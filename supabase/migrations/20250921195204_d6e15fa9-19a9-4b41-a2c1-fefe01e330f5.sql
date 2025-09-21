-- Update evolution_crm_instances table with the new API configuration
UPDATE evolution_crm_instances 
SET 
  server_url = 'https://evo.ilikeia.shop',
  api_key = 'ce4ea168352144d38e98be0274f9a662',
  updated_at = now()
WHERE empresa_id IS NOT NULL;