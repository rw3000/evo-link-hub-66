export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ab_test_results: {
        Row: {
          conversion: boolean | null
          id: string
          lead_id: string
          recorded_at: string
          test_id: string
          variant: string
        }
        Insert: {
          conversion?: boolean | null
          id?: string
          lead_id: string
          recorded_at?: string
          test_id: string
          variant: string
        }
        Update: {
          conversion?: boolean | null
          id?: string
          lead_id?: string
          recorded_at?: string
          test_id?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_results_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "campaign_ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_automations: {
        Row: {
          ativo: boolean | null
          configuracao: Json
          created_at: string
          empresa_id: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          configuracao?: Json
          created_at?: string
          empresa_id: string
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          configuracao?: Json
          created_at?: string
          empresa_id?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advanced_automations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      atendimento_filas: {
        Row: {
          ativa: boolean | null
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendimento_filas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      automacao_acoes: {
        Row: {
          automacao_id: string
          created_at: string
          id: string
          ordem: number | null
          parametros: Json | null
          tipo: string
        }
        Insert: {
          automacao_id: string
          created_at?: string
          id?: string
          ordem?: number | null
          parametros?: Json | null
          tipo: string
        }
        Update: {
          automacao_id?: string
          created_at?: string
          id?: string
          ordem?: number | null
          parametros?: Json | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "automacao_acoes_automacao_id_fkey"
            columns: ["automacao_id"]
            isOneToOne: false
            referencedRelation: "automacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      automacao_gatilhos: {
        Row: {
          automacao_id: string
          condicoes: Json | null
          created_at: string
          id: string
          tipo: string
        }
        Insert: {
          automacao_id: string
          condicoes?: Json | null
          created_at?: string
          id?: string
          tipo: string
        }
        Update: {
          automacao_id?: string
          condicoes?: Json | null
          created_at?: string
          id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "automacao_gatilhos_automacao_id_fkey"
            columns: ["automacao_id"]
            isOneToOne: false
            referencedRelation: "automacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      automacao_logs: {
        Row: {
          automacao_id: string
          detalhes: Json | null
          executado_em: string
          id: string
          lead_id: string | null
          status: string
        }
        Insert: {
          automacao_id: string
          detalhes?: Json | null
          executado_em?: string
          id?: string
          lead_id?: string | null
          status: string
        }
        Update: {
          automacao_id?: string
          detalhes?: Json | null
          executado_em?: string
          id?: string
          lead_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automacao_logs_automacao_id_fkey"
            columns: ["automacao_id"]
            isOneToOne: false
            referencedRelation: "automacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automacao_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      automacoes: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_ab_tests: {
        Row: {
          created_at: string
          descricao: string | null
          empresa_id: string
          ended_at: string | null
          id: string
          nome: string
          started_at: string | null
          status: string | null
          variant_a: Json
          variant_b: Json
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          empresa_id: string
          ended_at?: string | null
          id?: string
          nome: string
          started_at?: string | null
          status?: string | null
          variant_a: Json
          variant_b: Json
        }
        Update: {
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          ended_at?: string | null
          id?: string
          nome?: string
          started_at?: string | null
          status?: string | null
          variant_a?: Json
          variant_b?: Json
        }
        Relationships: [
          {
            foreignKeyName: "campaign_ab_tests_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      campanha_envios: {
        Row: {
          aberto_em: string | null
          campanha_id: string
          clicado_em: string | null
          created_at: string
          enviado_em: string | null
          erro: string | null
          id: string
          lead_id: string
          status: string | null
          tentativas: number | null
        }
        Insert: {
          aberto_em?: string | null
          campanha_id: string
          clicado_em?: string | null
          created_at?: string
          enviado_em?: string | null
          erro?: string | null
          id?: string
          lead_id: string
          status?: string | null
          tentativas?: number | null
        }
        Update: {
          aberto_em?: string | null
          campanha_id?: string
          clicado_em?: string | null
          created_at?: string
          enviado_em?: string | null
          erro?: string | null
          id?: string
          lead_id?: string
          status?: string | null
          tentativas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campanha_envios_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanha_envios_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas: {
        Row: {
          agendado_para: string | null
          assunto: string | null
          conteudo: string | null
          created_at: string
          empresa_id: string
          id: string
          nome: string
          status: string | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          agendado_para?: string | null
          assunto?: string | null
          conteudo?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          nome: string
          status?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          agendado_para?: string | null
          assunto?: string | null
          conteudo?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          nome?: string
          status?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      card_comments: {
        Row: {
          card_id: string
          conteudo: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          conteudo: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "kanban_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversa_assignments: {
        Row: {
          atribuida_em: string
          consultor_id: string
          conversa_id: string
          id: string
        }
        Insert: {
          atribuida_em?: string
          consultor_id: string
          conversa_id: string
          id?: string
        }
        Update: {
          atribuida_em?: string
          consultor_id?: string
          conversa_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversa_assignments_consultor_id_fkey"
            columns: ["consultor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversa_assignments_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: true
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
        ]
      }
      conversas: {
        Row: {
          canal: string | null
          consultor_id: string | null
          criada_em: string
          empresa_id: string
          fechada_em: string | null
          id: string
          lead_id: string | null
          status: string | null
        }
        Insert: {
          canal?: string | null
          consultor_id?: string | null
          criada_em?: string
          empresa_id: string
          fechada_em?: string | null
          id?: string
          lead_id?: string | null
          status?: string | null
        }
        Update: {
          canal?: string | null
          consultor_id?: string | null
          criada_em?: string
          empresa_id?: string
          fechada_em?: string | null
          id?: string
          lead_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_consultor_id_fkey"
            columns: ["consultor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      etiquetas: {
        Row: {
          cor: string | null
          created_at: string
          empresa_id: string
          id: string
          nome: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "etiquetas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_config: {
        Row: {
          api_key: string
          created_at: string
          empresa_id: string
          id: string
          is_active: boolean | null
          server_url: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          created_at?: string
          empresa_id: string
          id?: string
          is_active?: boolean | null
          server_url: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string
          empresa_id?: string
          id?: string
          is_active?: boolean | null
          server_url?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_api_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_crm_contatos: {
        Row: {
          avatar_url: string | null
          created_at: string
          empresa_id: string
          id: string
          instance_id: string
          nome: string | null
          numero: string
          ultima_interacao: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          instance_id: string
          nome?: string | null
          numero: string
          ultima_interacao?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          instance_id?: string
          nome?: string | null
          numero?: string
          ultima_interacao?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_evolution_crm_contatos_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evolution_crm_contatos_instance"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_crm_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_crm_conversas: {
        Row: {
          contato_id: string
          created_at: string
          empresa_id: string
          id: string
          instance_id: string
          nao_lidas: number | null
          status: string | null
          ultima_mensagem: string | null
          ultima_mensagem_timestamp: string | null
          updated_at: string
        }
        Insert: {
          contato_id: string
          created_at?: string
          empresa_id: string
          id?: string
          instance_id: string
          nao_lidas?: number | null
          status?: string | null
          ultima_mensagem?: string | null
          ultima_mensagem_timestamp?: string | null
          updated_at?: string
        }
        Update: {
          contato_id?: string
          created_at?: string
          empresa_id?: string
          id?: string
          instance_id?: string
          nao_lidas?: number | null
          status?: string | null
          ultima_mensagem?: string | null
          ultima_mensagem_timestamp?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_evolution_crm_conversas_contato"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "evolution_crm_contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evolution_crm_conversas_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evolution_crm_conversas_instance"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_crm_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_crm_instances: {
        Row: {
          api_key: string
          created_at: string
          empresa_id: string
          id: string
          nome: string
          server_url: string
          status: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          created_at?: string
          empresa_id: string
          id?: string
          nome: string
          server_url?: string
          status?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string
          empresa_id?: string
          id?: string
          nome?: string
          server_url?: string
          status?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_evolution_crm_instances_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_crm_mensagens: {
        Row: {
          conteudo: string
          conversa_id: string
          created_at: string
          direcao: string
          empresa_id: string
          id: string
          numero_destinatario: string
          numero_remetente: string
          status: string | null
          timestamp_evolution: string
          tipo: string | null
        }
        Insert: {
          conteudo: string
          conversa_id: string
          created_at?: string
          direcao: string
          empresa_id: string
          id?: string
          numero_destinatario: string
          numero_remetente: string
          status?: string | null
          timestamp_evolution: string
          tipo?: string | null
        }
        Update: {
          conteudo?: string
          conversa_id?: string
          created_at?: string
          direcao?: string
          empresa_id?: string
          id?: string
          numero_destinatario?: string
          numero_remetente?: string
          status?: string | null
          timestamp_evolution?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_evolution_crm_mensagens_conversa"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "evolution_crm_conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evolution_crm_mensagens_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_crm_stats: {
        Row: {
          empresa_id: string
          id: string
          instance_id: string
          mensagens_enviadas: number | null
          mensagens_recebidas: number | null
          total_contatos: number | null
          total_conversas: number | null
          updated_at: string
        }
        Insert: {
          empresa_id: string
          id?: string
          instance_id: string
          mensagens_enviadas?: number | null
          mensagens_recebidas?: number | null
          total_contatos?: number | null
          total_conversas?: number | null
          updated_at?: string
        }
        Update: {
          empresa_id?: string
          id?: string
          instance_id?: string
          mensagens_enviadas?: number | null
          mensagens_recebidas?: number | null
          total_contatos?: number | null
          total_conversas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_evolution_crm_stats_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evolution_crm_stats_instance"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_crm_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_instances: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          instance_data: Json | null
          instance_name: string
          last_ping: string | null
          phone_number: string | null
          qr_code: string | null
          status: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          instance_data?: Json | null
          instance_name: string
          last_ping?: string | null
          phone_number?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          instance_data?: Json | null
          instance_name?: string
          last_ping?: string | null
          phone_number?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_instances_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string
          direction: string
          empresa_id: string
          from_number: string
          id: string
          instance_id: string
          media_type: string | null
          media_url: string | null
          message_id: string
          message_type: string | null
          metadata: Json | null
          status: string | null
          timestamp: string
          to_number: string | null
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          direction: string
          empresa_id: string
          from_number: string
          id?: string
          instance_id: string
          media_type?: string | null
          media_url?: string | null
          message_id: string
          message_type?: string | null
          metadata?: Json | null
          status?: string | null
          timestamp?: string
          to_number?: string | null
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          direction?: string
          empresa_id?: string
          from_number?: string
          id?: string
          instance_id?: string
          media_type?: string | null
          media_url?: string | null
          message_id?: string
          message_type?: string | null
          metadata?: Json | null
          status?: string | null
          timestamp?: string
          to_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_messages_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolution_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      fila_consultores: {
        Row: {
          ativo: boolean | null
          consultor_id: string
          created_at: string
          fila_id: string
          id: string
        }
        Insert: {
          ativo?: boolean | null
          consultor_id: string
          created_at?: string
          fila_id: string
          id?: string
        }
        Update: {
          ativo?: boolean | null
          consultor_id?: string
          created_at?: string
          fila_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fila_consultores_consultor_id_fkey"
            columns: ["consultor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fila_consultores_fila_id_fkey"
            columns: ["fila_id"]
            isOneToOne: false
            referencedRelation: "atendimento_filas"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_boards: {
        Row: {
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "kanban_boards_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_cards: {
        Row: {
          column_id: string
          created_at: string
          descricao: string | null
          id: string
          lead_id: string | null
          ordem: number
          prazo: string | null
          prioridade: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          column_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          ordem: number
          prazo?: string | null
          prioridade?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          column_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          ordem?: number
          prazo?: string | null
          prioridade?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kanban_cards_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "kanban_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kanban_cards_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_columns: {
        Row: {
          board_id: string
          cor: string | null
          created_at: string
          id: string
          ordem: number
          titulo: string
        }
        Insert: {
          board_id: string
          cor?: string | null
          created_at?: string
          id?: string
          ordem: number
          titulo: string
        }
        Update: {
          board_id?: string
          cor?: string | null
          created_at?: string
          id?: string
          ordem?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "kanban_columns_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "kanban_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          empresa_id: string
          id: string
          nome: string
          observacoes: string | null
          origem: string | null
          status: string | null
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          observacoes?: string | null
          origem?: string | null
          status?: string | null
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          observacoes?: string | null
          origem?: string | null
          status?: string | null
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          conteudo: string
          conversa_id: string
          enviada_em: string
          id: string
          lida_em: string | null
          remetente_id: string | null
          tipo: string | null
        }
        Insert: {
          conteudo: string
          conversa_id: string
          enviada_em?: string
          id?: string
          lida_em?: string | null
          remetente_id?: string | null
          tipo?: string | null
        }
        Update: {
          conteudo?: string
          conversa_id?: string
          enviada_em?: string
          id?: string
          lida_em?: string | null
          remetente_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_remetente_id_fkey"
            columns: ["remetente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_dispatches: {
        Row: {
          campanha_id: string | null
          content: string
          created_at: string
          empresa_id: string
          error_message: string | null
          id: string
          lead_id: string
          message_type: string | null
          retry_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campanha_id?: string | null
          content: string
          created_at?: string
          empresa_id: string
          error_message?: string | null
          id?: string
          lead_id: string
          message_type?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campanha_id?: string | null
          content?: string
          created_at?: string
          empresa_id?: string
          error_message?: string | null
          id?: string
          lead_id?: string
          message_type?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_dispatches_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_dispatches_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_dispatches_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_executions: {
        Row: {
          created_at: string
          data: Json | null
          empresa_id: string
          execution_id: string
          finished_at: string | null
          id: string
          started_at: string
          status: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          empresa_id: string
          execution_id: string
          finished_at?: string | null
          id?: string
          started_at: string
          status: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          empresa_id?: string
          execution_id?: string
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "n8n_executions_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          departamento: string | null
          empresa_id: string | null
          id: string
          nome: string | null
          papel: string | null
          status_disponibilidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          departamento?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          papel?: string | null
          status_disponibilidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          departamento?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          papel?: string | null
          status_disponibilidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          empresa_id: string | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          empresa_id?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          recorded_at?: string
        }
        Update: {
          empresa_id?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_metrics_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_credits: {
        Row: {
          balance: number | null
          empresa_id: string
          id: string
          total_purchased: number | null
          total_used: number | null
          updated_at: string
        }
        Insert: {
          balance?: number | null
          empresa_id: string
          id?: string
          total_purchased?: number | null
          total_used?: number | null
          updated_at?: string
        }
        Update: {
          balance?: number | null
          empresa_id?: string
          id?: string
          total_purchased?: number | null
          total_used?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_credits_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_empresa_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
