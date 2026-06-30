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
      leads: {
        Row: {
          brand: string | null
          category: string | null
          city: string | null
          created_at: string
          email: string
          estimated_ticket_max: number | null
          estimated_ticket_min: number | null
          id: string
          media_urls: string[]
          message: string | null
          model: string | null
          name: string
          neighborhood: string | null
          phone: string
          referrer: string | null
          service: string | null
          service_mode: string | null
          sla_days_max: number | null
          sla_days_min: number | null
          source: string | null
          status: string
          symptom: string | null
          symptom_slug: string | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          triage_completed: boolean
          triage_payload: Json | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email: string
          estimated_ticket_max?: number | null
          estimated_ticket_min?: number | null
          id?: string
          media_urls?: string[]
          message?: string | null
          model?: string | null
          name: string
          neighborhood?: string | null
          phone: string
          referrer?: string | null
          service?: string | null
          service_mode?: string | null
          sla_days_max?: number | null
          sla_days_min?: number | null
          source?: string | null
          status?: string
          symptom?: string | null
          symptom_slug?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          triage_completed?: boolean
          triage_payload?: Json | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string
          estimated_ticket_max?: number | null
          estimated_ticket_min?: number | null
          id?: string
          media_urls?: string[]
          message?: string | null
          model?: string | null
          name?: string
          neighborhood?: string | null
          phone?: string
          referrer?: string | null
          service?: string | null
          service_mode?: string | null
          sla_days_max?: number | null
          sla_days_min?: number | null
          source?: string | null
          status?: string
          symptom?: string | null
          symptom_slug?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          triage_completed?: boolean
          triage_payload?: Json | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      terms_acceptances: {
        Row: {
          accepted_at: string
          created_at: string
          email: string | null
          id: string
          ip_address: string | null
          name: string
          phone: string
          service: string | null
        }
        Insert: {
          accepted_at?: string
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          name: string
          phone: string
          service?: string | null
        }
        Update: {
          accepted_at?: string
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          name?: string
          phone?: string
          service?: string | null
        }
        Relationships: []
      }
      triage_alert_state: {
        Row: {
          id: string
          last_alert_at: string
          updated_at: string
        }
        Insert: {
          id: string
          last_alert_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          last_alert_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      triage_media_failures: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          reason: string
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          reason: string
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          reason?: string
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      triage_media_uploads: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          lead_id: string | null
          mime_type: string | null
          object_path: string
          session_id: string
          size_bytes: number | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          mime_type?: string | null
          object_path: string
          session_id: string
          size_bytes?: number | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          mime_type?: string | null
          object_path?: string
          session_id?: string
          size_bytes?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "triage_media_uploads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
