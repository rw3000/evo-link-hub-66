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
    const { instanceId, phoneNumber, message } = await req.json();

    if (!instanceId || !phoneNumber || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get instance details
    const { data: instance, error: instanceError } = await supabase
      .from('evolution_crm_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (instanceError || !instance) {
      return new Response(JSON.stringify({ error: 'Instance not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send message via Evolution API
    const evolutionResponse = await fetch(`${instance.server_url}/message/sendText/${instance.nome}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': instance.api_key,
      },
      body: JSON.stringify({
        number: phoneNumber,
        text: message,
      }),
    });

    if (!evolutionResponse.ok) {
      const errorData = await evolutionResponse.text();
      console.error('Evolution API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send message via Evolution API' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const evolutionData = await evolutionResponse.json();
    console.log('Message sent via Evolution API:', evolutionData);

    // Find or create contact
    let { data: contact } = await supabase
      .from('evolution_crm_contatos')
      .select('id')
      .eq('instance_id', instanceId)
      .eq('numero', phoneNumber)
      .single();

    if (!contact) {
      const { data: newContact, error: contactError } = await supabase
        .from('evolution_crm_contatos')
        .insert([{
          instance_id: instanceId,
          empresa_id: instance.empresa_id,
          numero: phoneNumber,
          ultima_interacao: new Date().toISOString(),
        }])
        .select('id')
        .single();

      if (contactError) {
        console.error('Error creating contact:', contactError);
      } else {
        contact = newContact;
      }
    }

    // Find or create conversation
    let { data: conversation } = await supabase
      .from('evolution_crm_conversas')
      .select('id')
      .eq('instance_id', instanceId)
      .eq('contato_id', contact?.id)
      .single();

    if (!conversation && contact) {
      const { data: newConversation, error: conversationError } = await supabase
        .from('evolution_crm_conversas')
        .insert([{
          instance_id: instanceId,
          empresa_id: instance.empresa_id,
          contato_id: contact.id,
          status: 'open',
        }])
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
      } else {
        conversation = newConversation;
      }
    }

    // Save message to database
    if (conversation) {
      const { error: messageError } = await supabase
        .from('evolution_crm_mensagens')
        .insert([{
          conversa_id: conversation.id,
          empresa_id: instance.empresa_id,
          numero_remetente: instance.nome, // Instance/business number
          numero_destinatario: phoneNumber,
          conteudo: message,
          tipo: 'text',
          direcao: 'outgoing',
          timestamp_evolution: new Date().toISOString(),
          status: 'sent',
        }]);

      if (messageError) {
        console.error('Error saving message:', messageError);
      }

      // Update conversation
      await supabase
        .from('evolution_crm_conversas')
        .update({
          ultima_mensagem: message,
          ultima_mensagem_timestamp: new Date().toISOString(),
          nao_lidas: 0,
        })
        .eq('id', conversation.id);
    }

    return new Response(JSON.stringify({ success: true, data: evolutionData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Send message error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});