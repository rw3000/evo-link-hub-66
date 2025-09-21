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
      const { data, error } = await supabase
        .from('evolution_crm_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstances(data || []);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as instâncias",
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
      // Get current user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .single();

      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      const instanceData = {
        ...formData,
        empresa_id: profile.empresa_id,
        webhook_url: `${window.location.origin}/webhook/${formData.nome.toLowerCase().replace(/\s+/g, '-')}`,
      };

      const { error } = await supabase
        .from('evolution_crm_instances')
        .insert([instanceData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Instância criada com sucesso",
      });

      setFormData({
        nome: "",
        api_key: "",
        server_url: "https://api.evolution.com",
      });
      setIsDialogOpen(false);
      fetchInstances();
    } catch (error) {
      console.error('Error creating instance:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar instância",
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4 mr-2" />
              Nova Instância
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Criar Nova Instância
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Instância</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Atendimento Principal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder="Sua chave da API Evolution"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="server_url">URL do Servidor</Label>
                <Input
                  id="server_url"
                  value={formData.server_url}
                  onChange={(e) => setFormData({ ...formData, server_url: e.target.value })}
                  placeholder="https://api.evolution.com"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Criando..." : "Criar Instância"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {instances.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma instância configurada</h3>
            <p className="text-muted-foreground mb-6">
              Crie sua primeira instância para começar a usar o CRM
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Instância
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
                      variant={instance.status === 'connected' ? 'default' : 'secondary'}
                      className={instance.status === 'connected' ? 'bg-crm-online' : 'bg-crm-offline'}
                    >
                      {instance.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteInstance(instance.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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