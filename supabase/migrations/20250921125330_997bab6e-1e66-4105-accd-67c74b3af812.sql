-- Create tables for Evolution API CRM system

-- Evolution instances table
CREATE TABLE public.evolution_crm_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  nome TEXT NOT NULL,
  api_key TEXT NOT NULL,
  server_url TEXT NOT NULL DEFAULT 'https://api.evolution.com',
  webhook_url TEXT,
  status TEXT DEFAULT 'disconnected',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evolution_crm_instances ENABLE ROW LEVEL SECURITY;

-- Contacts table
CREATE TABLE public.evolution_crm_contatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  numero TEXT NOT NULL,
  nome TEXT,
  avatar_url TEXT,
  ultima_interacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evolution_crm_contatos ENABLE ROW LEVEL SECURITY;

-- Conversations table
CREATE TABLE public.evolution_crm_conversas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  contato_id UUID NOT NULL,
  status TEXT DEFAULT 'open',
  ultima_mensagem TEXT,
  ultima_mensagem_timestamp TIMESTAMP WITH TIME ZONE,
  nao_lidas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evolution_crm_conversas ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE public.evolution_crm_mensagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversa_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  numero_remetente TEXT NOT NULL,
  numero_destinatario TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tipo TEXT DEFAULT 'text',
  direcao TEXT NOT NULL, -- 'incoming' or 'outgoing'
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read'
  timestamp_evolution TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evolution_crm_mensagens ENABLE ROW LEVEL SECURITY;

-- Statistics table for dashboard
CREATE TABLE public.evolution_crm_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  instance_id UUID NOT NULL,
  total_contatos INTEGER DEFAULT 0,
  total_conversas INTEGER DEFAULT 0,
  mensagens_enviadas INTEGER DEFAULT 0,
  mensagens_recebidas INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evolution_crm_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Company users can access evolution_crm_instances" 
ON public.evolution_crm_instances 
FOR ALL 
USING (empresa_id = get_user_empresa_id());

CREATE POLICY "Company users can access evolution_crm_contatos" 
ON public.evolution_crm_contatos 
FOR ALL 
USING (empresa_id = get_user_empresa_id());

CREATE POLICY "Company users can access evolution_crm_conversas" 
ON public.evolution_crm_conversas 
FOR ALL 
USING (empresa_id = get_user_empresa_id());

CREATE POLICY "Company users can access evolution_crm_mensagens" 
ON public.evolution_crm_mensagens 
FOR ALL 
USING (empresa_id = get_user_empresa_id());

CREATE POLICY "Company users can access evolution_crm_stats" 
ON public.evolution_crm_stats 
FOR ALL 
USING (empresa_id = get_user_empresa_id());

-- Add foreign key constraints
ALTER TABLE public.evolution_crm_instances 
ADD CONSTRAINT fk_evolution_crm_instances_empresa 
FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);

ALTER TABLE public.evolution_crm_contatos 
ADD CONSTRAINT fk_evolution_crm_contatos_instance 
FOREIGN KEY (instance_id) REFERENCES public.evolution_crm_instances(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_evolution_crm_contatos_empresa 
FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);

ALTER TABLE public.evolution_crm_conversas 
ADD CONSTRAINT fk_evolution_crm_conversas_instance 
FOREIGN KEY (instance_id) REFERENCES public.evolution_crm_instances(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_evolution_crm_conversas_contato 
FOREIGN KEY (contato_id) REFERENCES public.evolution_crm_contatos(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_evolution_crm_conversas_empresa 
FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);

ALTER TABLE public.evolution_crm_mensagens 
ADD CONSTRAINT fk_evolution_crm_mensagens_conversa 
FOREIGN KEY (conversa_id) REFERENCES public.evolution_crm_conversas(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_evolution_crm_mensagens_empresa 
FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);

ALTER TABLE public.evolution_crm_stats 
ADD CONSTRAINT fk_evolution_crm_stats_instance 
FOREIGN KEY (instance_id) REFERENCES public.evolution_crm_instances(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_evolution_crm_stats_empresa 
FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);

-- Create indexes for better performance
CREATE INDEX idx_evolution_crm_contatos_instance ON public.evolution_crm_contatos(instance_id);
CREATE INDEX idx_evolution_crm_conversas_instance ON public.evolution_crm_conversas(instance_id);
CREATE INDEX idx_evolution_crm_conversas_contato ON public.evolution_crm_conversas(contato_id);
CREATE INDEX idx_evolution_crm_mensagens_conversa ON public.evolution_crm_mensagens(conversa_id);
CREATE INDEX idx_evolution_crm_mensagens_timestamp ON public.evolution_crm_mensagens(timestamp_evolution);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_evolution_crm_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_evolution_crm_instances_updated_at
BEFORE UPDATE ON public.evolution_crm_instances
FOR EACH ROW
EXECUTE FUNCTION public.update_evolution_crm_updated_at_column();

CREATE TRIGGER update_evolution_crm_contatos_updated_at
BEFORE UPDATE ON public.evolution_crm_contatos
FOR EACH ROW
EXECUTE FUNCTION public.update_evolution_crm_updated_at_column();

CREATE TRIGGER update_evolution_crm_conversas_updated_at
BEFORE UPDATE ON public.evolution_crm_conversas
FOR EACH ROW
EXECUTE FUNCTION public.update_evolution_crm_updated_at_column();