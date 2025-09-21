-- Create a default company and profile for testing
INSERT INTO empresas (id, nome, created_at, updated_at) 
VALUES ('11111111-1111-1111-1111-111111111111', 'EvoLink Demo', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create a default profile linked to auth if needed, otherwise create a system profile
INSERT INTO profiles (id, user_id, empresa_id, nome, papel, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'Sistema EvoLink',
  'admin',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;