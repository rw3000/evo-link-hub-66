import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL')!;
const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching instances from Evolution API...');
    
    // List all instances from Evolution API
    const evolutionResponse = await fetch(`${evolutionApiUrl}/instance/fetchInstances`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': evolutionApiKey,
      },
    });

    if (!evolutionResponse.ok) {
      const errorData = await evolutionResponse.text();
      console.error('Evolution API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to fetch instances from Evolution API' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const instances = await evolutionResponse.json();
    console.log('Fetched instances:', instances);

    // Transform the data to match our expected format
    const transformedInstances = instances.map((instance: any) => ({
      id: instance.instanceId || instance.instance?.instanceName || 'unknown',
      nome: instance.instance?.instanceName || instance.instanceName || 'Instância sem nome',
      status: instance.instance?.state || instance.state || 'unknown',
      server_url: evolutionApiUrl,
      api_key: '***hidden***',
      webhook_url: instance.instance?.webhook || null,
      created_at: new Date().toISOString(),
      phone_number: instance.instance?.number || null,
      profileName: instance.instance?.profileName || null,
      profilePictureUrl: instance.instance?.profilePictureUrl || null,
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      instances: transformedInstances,
      total: transformedInstances.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('List instances error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});