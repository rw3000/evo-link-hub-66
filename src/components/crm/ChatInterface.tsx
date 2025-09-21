import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, MessageSquare, Phone, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  numero: string;
  nome: string | null;
  avatar_url: string | null;
  ultima_interacao: string | null;
}

interface Conversation {
  id: string;
  contato_id: string;
  instance_id: string;
  status: string;
  ultima_mensagem: string | null;
  ultima_mensagem_timestamp: string | null;
  nao_lidas: number;
}

interface Message {
  id: string;
  conteudo: string;
  direcao: string;
  timestamp_evolution: string;
  status: string;
}

const ChatInterface = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('evolution_crm_contatos')
        .select('*')
        .order('ultima_interacao', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('evolution_crm_conversas')
        .select('*')
        .order('ultima_mensagem_timestamp', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('evolution_crm_mensagens')
        .select('*')
        .eq('conversa_id', conversationId)
        .order('timestamp_evolution', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Find conversation for this contact
    const conversation = conversations.find(c => c.contato_id === contact.id);
    if (conversation) {
      setSelectedConversation(conversation);
    } else {
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedContact || sending) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-message', {
        body: {
          instanceId: selectedConversation?.instance_id,
          phoneNumber: selectedContact.numero,
          message: messageText.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      setMessageText("");
      
      // Refresh messages
      if (selectedConversation) {
        fetchMessages(selectedConversation.id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.numero.includes(searchTerm)
  );

  const getInitials = (name: string | null, phone: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return phone.slice(-2);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="h-[600px] flex rounded-lg overflow-hidden border">
        <div className="w-1/3 border-r bg-card animate-pulse">
          <div className="p-4 border-b">
            <div className="h-10 bg-muted rounded"></div>
          </div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-crm-chat-bg animate-pulse">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-muted rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Chat</h2>
        <p className="text-muted-foreground">
          Interface de mensagens estilo WhatsApp Web
        </p>
      </div>

      <Card className="h-[600px] flex rounded-lg overflow-hidden">
        {/* Sidebar - Contacts List */}
        <div className="w-1/3 border-r bg-card flex flex-col">
          <div className="p-4 border-b bg-crm-sidebar text-crm-sidebar-foreground">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crm-sidebar-foreground/60" />
              <Input
                placeholder="Pesquisar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-crm-sidebar-foreground placeholder:text-crm-sidebar-foreground/60"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum contato encontrado</p>
                <p className="text-sm">Configure uma instância para sincronizar contatos</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredContacts.map((contact) => {
                  const conversation = conversations.find(c => c.contato_id === contact.id);
                  const isSelected = selectedContact?.id === contact.id;
                  
                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        isSelected ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(contact.nome, contact.numero)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              {contact.nome || contact.numero}
                            </h3>
                            {conversation?.ultima_mensagem_timestamp && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.ultima_mensagem_timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation?.ultima_mensagem || 'Nenhuma mensagem'}
                            </p>
                            {conversation && conversation.nao_lidas > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">
                                {conversation.nao_lidas}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-crm-chat-bg">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(selectedContact.nome, selectedContact.numero)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedContact.nome || selectedContact.numero}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.numero}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma mensagem</p>
                    <p className="text-sm">Inicie uma conversa</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direcao === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.direcao === 'outgoing'
                            ? 'bg-crm-message-outgoing text-crm-message-outgoing-foreground'
                            : 'bg-crm-message-incoming shadow-sm border'
                        }`}
                      >
                        <p className="text-sm">{message.conteudo}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.direcao === 'outgoing'
                              ? 'text-crm-message-outgoing-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatTime(message.timestamp_evolution)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!messageText.trim() || sending}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Selecione um contato</h3>
                <p>Escolha um contato da lista para iniciar uma conversa</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;