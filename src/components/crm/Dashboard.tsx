import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, Send, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "./StatsCard";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalContatos: number;
  totalConversas: number;
  mensagensEnviadas: number;
  mensagensRecebidas: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContatos: 0,
    totalConversas: 0,
    mensagensEnviadas: 0,
    mensagensRecebidas: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get contacts count
      const { count: contactsCount } = await supabase
        .from('evolution_crm_contatos')
        .select('*', { count: 'exact', head: true });

      // Get conversations count
      const { count: conversasCount } = await supabase
        .from('evolution_crm_conversas')
        .select('*', { count: 'exact', head: true });

      // Get sent messages count
      const { count: sentCount } = await supabase
        .from('evolution_crm_mensagens')
        .select('*', { count: 'exact', head: true })
        .eq('direcao', 'outgoing');

      // Get received messages count
      const { count: receivedCount } = await supabase
        .from('evolution_crm_mensagens')
        .select('*', { count: 'exact', head: true })
        .eq('direcao', 'incoming');

      setStats({
        totalContatos: contactsCount || 0,
        totalConversas: conversasCount || 0,
        mensagensEnviadas: sentCount || 0,
        mensagensRecebidas: receivedCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total de Contatos",
      value: stats.totalContatos,
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Conversas Ativas", 
      value: stats.totalConversas,
      icon: MessageCircle,
      color: "secondary" as const,
    },
    {
      title: "Mensagens Enviadas",
      value: stats.mensagensEnviadas,
      icon: Send,
      color: "accent" as const,
    },
    {
      title: "Mensagens Recebidas",
      value: stats.mensagensRecebidas,
      icon: Activity,
      color: "warning" as const,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-8 bg-muted rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral das atividades do CRM</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Activity Section */}
      <Card className="minimal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground mb-1">Nenhuma atividade recente</h3>
            <p className="text-sm text-muted-foreground">
              Configure uma instância para começar
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;