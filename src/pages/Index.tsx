import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Settings, BarChart3, Zap } from "lucide-react";
import Dashboard from "@/components/crm/Dashboard";
import InstanceManagement from "@/components/crm/InstanceManagement";
import ChatInterface from "@/components/crm/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">EvoLink Hub</h1>
              <p className="text-sm text-muted-foreground">Sistema CRM Evolution API</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-muted/30">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="instances" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Instâncias</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="instances">
            <InstanceManagement />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;