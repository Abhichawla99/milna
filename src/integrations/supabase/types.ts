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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agent_documents: {
        Row: {
          agent_id: string
          created_at: string
          file_path: string
          file_size: number | null
          file_url: string
          filename: string
          id: string
          mime_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          file_path: string
          file_size?: number | null
          file_url: string
          filename: string
          id?: string
          mime_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_url?: string
          filename?: string
          id?: string
          mime_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agent_integrations: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          integration_config: Json
          integration_type: string
          is_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          integration_config?: Json
          integration_type: string
          is_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          integration_config?: Json
          integration_type?: string
          is_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_integrations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_knowledge: {
        Row: {
          agent_id: string | null
          author: string | null
          checksum: string | null
          chunk_index: number | null
          content: string
          content_html: string | null
          content_tokens: number | null
          created_at: string
          document_id: string | null
          embedding: string | null
          id: number
          is_active: boolean
          language: string | null
          metadata: Json
          mime_type: string | null
          source_id: string | null
          source_type: string | null
          title: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          agent_id?: string | null
          author?: string | null
          checksum?: string | null
          chunk_index?: number | null
          content: string
          content_html?: string | null
          content_tokens?: number | null
          created_at?: string
          document_id?: string | null
          embedding?: string | null
          id?: number
          is_active?: boolean
          language?: string | null
          metadata?: Json
          mime_type?: string | null
          source_id?: string | null
          source_type?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          agent_id?: string | null
          author?: string | null
          checksum?: string | null
          chunk_index?: number | null
          content?: string
          content_html?: string | null
          content_tokens?: number | null
          created_at?: string
          document_id?: string | null
          embedding?: string | null
          id?: number
          is_active?: boolean
          language?: string | null
          metadata?: Json
          mime_type?: string | null
          source_id?: string | null
          source_type?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          agent_id: string | null
          analytics_data: Json | null
          api_keys: Json | null
          created_at: string
          deleted_at: string | null
          embed_code: string | null
          goal: string | null
          id: string
          instructions: string | null
          integrations: Json | null
          knowledge_urls: string[] | null
          name: string
          status: string
          tone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          analytics_data?: Json | null
          api_keys?: Json | null
          created_at?: string
          deleted_at?: string | null
          embed_code?: string | null
          goal?: string | null
          id?: string
          instructions?: string | null
          integrations?: Json | null
          knowledge_urls?: string[] | null
          name?: string
          status?: string
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          analytics_data?: Json | null
          api_keys?: Json | null
          created_at?: string
          deleted_at?: string | null
          embed_code?: string | null
          goal?: string | null
          id?: string
          instructions?: string | null
          integrations?: Json | null
          knowledge_urls?: string[] | null
          name?: string
          status?: string
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appsumo_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_redeemed: boolean
          redeemed_at: string | null
          redeemed_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          agent_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          messages_count: number | null
          visitor_id: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          messages_count?: number | null
          visitor_id?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          messages_count?: number | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          timestamp: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type: string
          timestamp?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_id: string
          conversation_id: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          message_count: number | null
          session_id: string
          started_at: string | null
          visitor_id: string
          visitor_info: Json | null
        }
        Insert: {
          agent_id: string
          conversation_id?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          session_id: string
          started_at?: string | null
          visitor_id: string
          visitor_info?: Json | null
        }
        Update: {
          agent_id?: string
          conversation_id?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          session_id?: string
          started_at?: string | null
          visitor_id?: string
          visitor_info?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          appsumo_redeemed: boolean | null
          cal_api_key: string | null
          cal_api_key_encrypted: string | null
          cal_event_type_id: number | null
          cal_user_id: string | null
          company_name: string
          created_at: string
          google_calendar_token: string | null
          has_permission: boolean
          id: string
          last_payment_date: string | null
          message_count: number | null
          name: string
          openai_api_key: string | null
          plan_type: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_expires_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
          website: string
          work_email: string
        }
        Insert: {
          appsumo_redeemed?: boolean | null
          cal_api_key?: string | null
          cal_api_key_encrypted?: string | null
          cal_event_type_id?: number | null
          cal_user_id?: string | null
          company_name: string
          created_at?: string
          google_calendar_token?: string | null
          has_permission?: boolean
          id?: string
          last_payment_date?: string | null
          message_count?: number | null
          name: string
          openai_api_key?: string | null
          plan_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
          website: string
          work_email: string
        }
        Update: {
          appsumo_redeemed?: boolean | null
          cal_api_key?: string | null
          cal_api_key_encrypted?: string | null
          cal_event_type_id?: number | null
          cal_user_id?: string | null
          company_name?: string
          created_at?: string
          google_calendar_token?: string | null
          has_permission?: boolean
          id?: string
          last_payment_date?: string | null
          message_count?: number | null
          name?: string
          openai_api_key?: string | null
          plan_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
          website?: string
          work_email?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { filter: Json; match_count: number; query_embedding: string }
        Returns: {
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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
