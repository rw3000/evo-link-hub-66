import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Copy, Check, Trash2, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Instance {
  id: string;
  nome: string;
  api_key: string;
  server_url: string;
  webhook_url: string | null;
  status: string;
  created_at: string;
  phone_number?: string | null;
  profileName?: string | null;
  profilePictureUrl?: string | null;
}

const InstanceManagement = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    api_key: "",
    server_url: "https://api.evolution.com",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      // Fetch instances from Evolution API directly
      const { data, error } = await supabase.functions.invoke('list-evolution-instances');
      
      if (error) throw error;
      
      if (data?.success) {
        setInstances(data.instances || []);
      } else {
        throw new Error(data?.error || 'Failed to fetch instances');
      }
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instâncias da Evolution API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      toast({
        title: "Informação",
        description: "As instâncias são carregadas automaticamente da Evolution API. Use o botão 'Atualizar' para recarregar a lista.",
      });
      
      setIsDialogOpen(false);
      fetchInstances();
    } catch (error) {
      console.error('Error refreshing instances:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar instâncias",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyWebhookUrl = async (webhookUrl: string, instanceId: string) => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopiedWebhook(instanceId);
      setTimeout(() => setCopiedWebhook(null), 2000);
      toast({
        title: "Copiado!",
        description: "URL do webhook copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL",
        variant: "destructive",
      });
    }
  };

  const deleteInstance = async (instanceId: string) => {
    try {
      const { error } = await supabase
        .from('evolution_crm_instances')
        .delete()
        .eq('id', instanceId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Instância removida com sucesso",
      });
      fetchInstances();
    } catch (error) {
      console.error('Error deleting instance:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover instância",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gerenciar Instâncias</h2>
          <p className="text-muted-foreground">
            Configure suas instâncias da Evolution API
          </p>
        </div>

        <Button 
          onClick={fetchInstances}
          className="bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Atualizar Instâncias
        </Button>
      </div>

      {instances.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma instância encontrada</h3>
            <p className="text-muted-foreground mb-6">
              Não foram encontradas instâncias ativas na Evolution API
            </p>
            <Button onClick={fetchInstances} className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              Atualizar Lista
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {instances.map((instance) => (
            <Card key={instance.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light">
                      <Link className="w-5 h-5 text-primary" />
                    </div>
                    {instance.nome}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={instance.status === 'open' ? 'default' : 'secondary'}
                      className={instance.status === 'open' ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {instance.status === 'open' ? 'Conectado' : instance.status || 'Desconhecido'}
                    </Badge>
                    {instance.phone_number && (
                      <Badge variant="outline" className="text-xs">
                        {instance.phone_number}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Servidor Evolution
                    </Label>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded mt-1">
                      {instance.server_url}
                    </p>
                  </div>

                  {instance.profileName && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Nome do Perfil
                      </Label>
                      <p className="text-sm bg-muted/50 p-2 rounded mt-1">
                        {instance.profileName}
                      </p>
                    </div>
                  )}

                  {instance.webhook_url && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        URL do Webhook
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-mono bg-muted/50 p-2 rounded flex-1 truncate">
                          {instance.webhook_url}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyWebhookUrl(instance.webhook_url!, instance.id)}
                          className="shrink-0"
                        >
                          {copiedWebhook === instance.id ? (
                            <Check className="w-4 h-4 text-crm-online" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cole esta URL no painel da Evolution Manager
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Criado em: {new Date(instance.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstanceManagement;