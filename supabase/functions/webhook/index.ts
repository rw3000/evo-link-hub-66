import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const instanceName = pathSegments[pathSegments.length - 1]; // Get last segment as instance name
    
    console.log('Webhook received for instance:', instanceName);
    console.log('Full path:', url.pathname);

    if (!instanceName) {
      return new Response(JSON.stringify({ error: 'Instance name required in path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookData = await req.json();
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2));

    // Find instance by webhook URL pattern
    const { data: instances, error: instanceError } = await supabase
      .from('evolution_crm_instances')
      .select('*')
      .ilike('webhook_url', `%${instanceName}%`);

    if (instanceError || !instances || instances.length === 0) {
      console.error('Instance not found for:', instanceName, instanceError);
      return new Response(JSON.stringify({ error: 'Instance not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const instance = instances[0];
    console.log('Processing webhook for instance:', instance.id);

    // Process webhook based on event type
    const event = webhookData.event || webhookData.type;
    console.log('Processing event:', event);

    switch (event) {
      case 'messages.upsert':
      case 'message.received':
      case 'message.sent':
        await handleMessageEvent(supabase, instance, webhookData);
        break;
      case 'connection.update':
      case 'qrcode.updated':
        await handleConnectionEvent(supabase, instance, webhookData);
        break;
      case 'contacts.upsert':
      case 'contact.updated':
        await handleContactEvent(supabase, instance, webhookData);
        break;
      default:
        console.log('Unhandled event type:', event);
        break;
    }

    return new Response(JSON.stringify({ success: true, processed: event }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleMessageEvent(supabase: any, instance: any, webhookData: any) {
  try {
    console.log('Processing message event');
    
    const messageData = webhookData.data || webhookData.message || webhookData;
    if (!messageData) {
      console.log('No message data found in webhook');
      return;
    }

    // Extract phone number and message details
    let fromNumber = '';
    let messageContent = '';
    let isIncoming = true;
    let messageTimestamp = new Date();

    // Handle different Evolution API webhook formats
    if (messageData.key) {
      // Standard Evolution format
      fromNumber = messageData.key.remoteJid?.split('@')[0] || '';
      isIncoming = !messageData.key.fromMe;
      messageTimestamp = new Date((messageData.messageTimestamp || Date.now() / 1000) * 1000);
      
      if (messageData.message?.conversation) {
        messageContent = messageData.message.conversation;
      } else if (messageData.message?.extendedTextMessage?.text) {
        messageContent = messageData.message.extendedTextMessage.text;
      } else if (messageData.message?.imageMessage) {
        messageContent = messageData.message.imageMessage.caption || '[Imagem]';
      } else {
        messageContent = '[Mensagem não suportada]';
      }
    } else if (messageData.from) {
      // Alternative format
      fromNumber = messageData.from.split('@')[0];
      messageContent = messageData.body || messageData.text || '[Sem conteúdo]';
      isIncoming = !messageData.fromMe;
    } else {
      console.log('Unable to parse message format');
      return;
    }

    if (!fromNumber) {
      console.log('No phone number found in message');
      return;
    }

    console.log('Processing message from:', fromNumber, 'Content:', messageContent);

    // Find or create contact
    let { data: contact, error: contactSelectError } = await supabase
      .from('evolution_crm_contatos')
      .select('id')
      .eq('instance_id', instance.id)
      .eq('numero', fromNumber)
      .maybeSingle();

    if (contactSelectError) {
      console.error('Error selecting contact:', contactSelectError);
      return;
    }

    if (!contact) {
      console.log('Creating new contact for:', fromNumber);
      const { data: newContact, error: contactError } = await supabase
        .from('evolution_crm_contatos')
        .insert([{
          instance_id: instance.id,
          empresa_id: instance.empresa_id,
          numero: fromNumber,
          nome: messageData.pushName || null,
          ultima_interacao: new Date().toISOString(),
        }])
        .select('id')
        .single();

      if (contactError) {
        console.error('Error creating contact:', contactError);
        return;
      }
      contact = newContact;
    } else {
      // Update last interaction
      await supabase
        .from('evolution_crm_contatos')
        .update({ ultima_interacao: new Date().toISOString() })
        .eq('id', contact.id);
    }

    // Find or create conversation
    let { data: conversation, error: conversationSelectError } = await supabase
      .from('evolution_crm_conversas')
      .select('id, nao_lidas')
      .eq('instance_id', instance.id)
      .eq('contato_id', contact.id)
      .maybeSingle();

    if (conversationSelectError) {
      console.error('Error selecting conversation:', conversationSelectError);
      return;
    }

    if (!conversation) {
      console.log('Creating new conversation');
      const { data: newConversation, error: conversationError } = await supabase
        .from('evolution_crm_conversas')
        .insert([{
          instance_id: instance.id,
          empresa_id: instance.empresa_id,
          contato_id: contact.id,
          status: 'open',
          nao_lidas: 0,
        }])
        .select('id, nao_lidas')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return;
      }
      conversation = newConversation;
    }

    // Save message
    const { error: messageError } = await supabase
      .from('evolution_crm_mensagens')
      .insert([{
        conversa_id: conversation.id,
        empresa_id: instance.empresa_id,
        numero_remetente: isIncoming ? fromNumber : instance.nome,
        numero_destinatario: isIncoming ? instance.nome : fromNumber,
        conteudo: messageContent,
        tipo: 'text',
        direcao: isIncoming ? 'incoming' : 'outgoing',
        timestamp_evolution: messageTimestamp.toISOString(),
        status: 'received',
      }]);

    if (messageError) {
      console.error('Error saving message:', messageError);
      return;
    }

    // Update conversation
    const newUnreadCount = isIncoming ? (conversation.nao_lidas || 0) + 1 : 0;
    await supabase
      .from('evolution_crm_conversas')
      .update({
        ultima_mensagem: messageContent,
        ultima_mensagem_timestamp: new Date().toISOString(),
        nao_lidas: newUnreadCount,
      })
      .eq('id', conversation.id);

    console.log('Message processed successfully');

  } catch (error) {
    console.error('Error in handleMessageEvent:', error);
  }
}

async function handleConnectionEvent(supabase: any, instance: any, webhookData: any) {
  try {
    console.log('Processing connection event');
    
    const connectionData = webhookData.data || webhookData;
    let status = 'disconnected';

    if (connectionData.state === 'open' || connectionData.status === 'connected') {
      status = 'connected';
    } else if (connectionData.qrcode) {
      status = 'connecting';
      // Could save QR code here if needed
    }

    await supabase
      .from('evolution_crm_instances')
      .update({ status })
      .eq('id', instance.id);

    console.log('Connection status updated to:', status);

  } catch (error) {
    console.error('Error in handleConnectionEvent:', error);
  }
}

async function handleContactEvent(supabase: any, instance: any, webhookData: any) {
  try {
    console.log('Processing contact event');
    
    const contactsData = webhookData.data || webhookData.contacts || [];
    if (!Array.isArray(contactsData)) {
      console.log('No valid contacts array found');
      return;
    }

    for (const contactData of contactsData) {
      const numero = contactData.id?.split('@')[0] || contactData.number?.split('@')[0];
      if (!numero) continue;

      await supabase
        .from('evolution_crm_contatos')
        .upsert([{
          instance_id: instance.id,
          empresa_id: instance.empresa_id,
          numero,
          nome: contactData.name || contactData.pushname || contactData.verifiedName || null,
          avatar_url: contactData.profilePictureUrl || null,
          ultima_interacao: new Date().toISOString(),
        }], {
          onConflict: 'instance_id,numero',
          ignoreDuplicates: false,
        });
    }

    console.log('Contacts processed successfully:', contactsData.length);

  } catch (error) {
    console.error('Error in handleContactEvent:', error);
  }
}