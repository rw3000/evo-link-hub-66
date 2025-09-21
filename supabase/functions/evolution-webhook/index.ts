import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  console.log('Webhook received:', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const instanceName = url.pathname.split('/')[1]; // Extract instance from path
    
    console.log('Processing webhook for instance:', instanceName);

    if (!instanceName) {
      return new Response(JSON.stringify({ error: 'Instance name required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookData = await req.json();
    console.log('Webhook data received:', JSON.stringify(webhookData, null, 2));

    // Find the instance
    const { data: instance, error: instanceError } = await supabase
      .from('evolution_crm_instances')
      .select('*')
      .eq('nome', instanceName.replace(/-/g, ' '))
      .single();

    if (instanceError || !instance) {
      console.error('Instance not found:', instanceError);
      return new Response(JSON.stringify({ error: 'Instance not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found instance:', instance.id);

    // Process different webhook events
    if (webhookData.event === 'messages.upsert') {
      await handleMessageEvent(supabase, instance, webhookData);
    } else if (webhookData.event === 'connection.update') {
      await handleConnectionEvent(supabase, instance, webhookData);
    } else if (webhookData.event === 'contacts.upsert') {
      await handleContactEvent(supabase, instance, webhookData);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleMessageEvent(supabase: any, instance: any, webhookData: any) {
  console.log('Handling message event');
  
  const message = webhookData.data;
  if (!message) return;

  const fromNumber = message.key?.remoteJid?.split('@')[0] || message.pushName || 'unknown';
  const toNumber = instance.nome; // Or get from message if available
  const isIncoming = !message.key?.fromMe;

  // First, ensure contact exists
  const { data: existingContact } = await supabase
    .from('evolution_crm_contatos')
    .select('id')
    .eq('instance_id', instance.id)
    .eq('numero', fromNumber)
    .single();

  let contactId = existingContact?.id;

  if (!contactId) {
    console.log('Creating new contact for:', fromNumber);
    const { data: newContact, error: contactError } = await supabase
      .from('evolution_crm_contatos')
      .insert([{
        instance_id: instance.id,
        empresa_id: instance.empresa_id,
        numero: fromNumber,
        nome: message.pushName || null,
        ultima_interacao: new Date().toISOString(),
      }])
      .select('id')
      .single();

    if (contactError) {
      console.error('Error creating contact:', contactError);
      return;
    }

    contactId = newContact.id;
  } else {
    // Update contact's last interaction
    await supabase
      .from('evolution_crm_contatos')
      .update({ ultima_interacao: new Date().toISOString() })
      .eq('id', contactId);
  }

  // Ensure conversation exists
  let { data: conversation } = await supabase
    .from('evolution_crm_conversas')
    .select('id')
    .eq('instance_id', instance.id)
    .eq('contato_id', contactId)
    .single();

  if (!conversation) {
    console.log('Creating new conversation');
    const { data: newConversation, error: conversationError } = await supabase
      .from('evolution_crm_conversas')
      .insert([{
        instance_id: instance.id,
        empresa_id: instance.empresa_id,
        contato_id: contactId,
        status: 'open',
      }])
      .select('id')
      .single();

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      return;
    }

    conversation = newConversation;
  }

  // Extract message content
  let messageContent = '';
  if (message.message?.conversation) {
    messageContent = message.message.conversation;
  } else if (message.message?.extendedTextMessage?.text) {
    messageContent = message.message.extendedTextMessage.text;
  } else if (message.message?.imageMessage?.caption) {
    messageContent = message.message.imageMessage.caption || '[Imagem]';
  } else {
    messageContent = '[Mensagem não suportada]';
  }

  // Save message
  console.log('Saving message:', messageContent);
  const { error: messageError } = await supabase
    .from('evolution_crm_mensagens')
    .insert([{
      conversa_id: conversation.id,
      empresa_id: instance.empresa_id,
      numero_remetente: fromNumber,
      numero_destinatario: toNumber,
      conteudo: messageContent,
      tipo: 'text',
      direcao: isIncoming ? 'incoming' : 'outgoing',
      timestamp_evolution: new Date(message.messageTimestamp * 1000).toISOString(),
      status: 'received',
    }]);

  if (messageError) {
    console.error('Error saving message:', messageError);
    return;
  }

  // Update conversation with last message
  await supabase
    .from('evolution_crm_conversas')
    .update({
      ultima_mensagem: messageContent,
      ultima_mensagem_timestamp: new Date().toISOString(),
      nao_lidas: isIncoming ? 1 : 0, // Increment if incoming, reset if outgoing
    })
    .eq('id', conversation.id);

  console.log('Message processed successfully');
}

async function handleConnectionEvent(supabase: any, instance: any, webhookData: any) {
  console.log('Handling connection event');
  
  const connectionData = webhookData.data;
  const status = connectionData?.state === 'open' ? 'connected' : 'disconnected';

  await supabase
    .from('evolution_crm_instances')
    .update({ status })
    .eq('id', instance.id);

  console.log('Instance status updated to:', status);
}

async function handleContactEvent(supabase: any, instance: any, webhookData: any) {
  console.log('Handling contact event');
  
  const contacts = webhookData.data;
  if (!Array.isArray(contacts)) return;

  for (const contact of contacts) {
    const numero = contact.id?.split('@')[0];
    if (!numero) continue;

    const { error } = await supabase
      .from('evolution_crm_contatos')
      .upsert([{
        instance_id: instance.id,
        empresa_id: instance.empresa_id,
        numero,
        nome: contact.name || contact.pushname || null,
        avatar_url: contact.profilePictureUrl || null,
        ultima_interacao: new Date().toISOString(),
      }], {
        onConflict: 'instance_id,numero'
      });

    if (error) {
      console.error('Error upserting contact:', error);
    }
  }

  console.log('Contacts processed successfully');
}