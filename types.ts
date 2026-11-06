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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      manager_sessions: {
        Row: {
          expires_at: string
          token_hash: string
        }
        Insert: {
          expires_at: string
          token_hash: string
        }
        Update: {
          expires_at?: string
          token_hash?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          available: boolean
          category: string
          description: string
          description_en: string
          id: string
          name: string
          name_en: string
          price: number
          sort_order: number
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean
          category: string
          description?: string
          description_en?: string
          id?: string
          name: string
          name_en: string
          price: number
          sort_order?: number
        }
        Update: {
          allergens?: string[] | null
          available?: boolean
          category?: string
          description?: string
          description_en?: string
          id?: string
          name?: string
          name_en?: string
          price?: number
          sort_order?: number
        }
        Relationships: []
      }
      offers: {
        Row: {
          active: boolean
          description: string
          description_en: string
          id: string
          price: number | null
          title: string
          title_en: string
        }
        Insert: {
          active?: boolean
          description?: string
          description_en?: string
          id?: string
          price?: number | null
          title: string
          title_en?: string
        }
        Update: {
          active?: boolean
          description?: string
          description_en?: string
          id?: string
          price?: number | null
          title?: string
          title_en?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          dish_name: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          quantity: number
          reservation_id: string | null
          service_date: string
          status: string
          table_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          dish_name: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          quantity: number
          reservation_id?: string | null
          service_date?: string
          status?: string
          table_id: string
          unit_price: number
        }
        Update: {
          created_at?: string
          dish_name?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          quantity?: number
          reservation_id?: string | null
          service_date?: string
          status?: string
          table_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string
          id: string
        }
        Insert: {
          display_name?: string
          id: string
        }
        Update: {
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          checked_in_at: string | null
          code: string | null
          created_at: string
          date: string
          guests: number
          id: string
          name: string
          notes: string | null
          phone: string
          qr_token: string | null
          status: string
          table_id: string | null
          time: string
        }
        Insert: {
          checked_in_at?: string | null
          code?: string | null
          created_at?: string
          date: string
          guests: number
          id?: string
          name: string
          notes?: string | null
          phone: string
          qr_token?: string | null
          status?: string
          table_id?: string | null
          time: string
        }
        Update: {
          checked_in_at?: string | null
          code?: string | null
          created_at?: string
          date?: string
          guests?: number
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          qr_token?: string | null
          status?: string
          table_id?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_table_fk"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          active: boolean
          capacity: number
          id: string
          label: string
          zone: string
        }
        Insert: {
          active?: boolean
          capacity?: number
          id?: string
          label: string
          zone?: string
        }
        Update: {
          active?: boolean
          capacity?: number
          id?: string
          label?: string
          zone?: string
        }
        Relationships: []
      }
      staff_invites: {
        Row: {
          active: boolean
          display_name: string
          email: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          display_name: string
          email: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          display_name?: string
          email?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staff_login_attempts: {
        Row: {
          attempts: number
          key: string
          last_attempt: string
        }
        Insert: {
          attempts?: number
          key: string
          last_attempt?: string
        }
        Update: {
          attempts?: number
          key?: string
          last_attempt?: string
        }
        Relationships: []
      }
      staff_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          recipient_id: string | null
          sender_id: string | null
          sender_name: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          recipient_id?: string | null
          sender_id?: string | null
          sender_name: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          recipient_id?: string | null
          sender_id?: string | null
          sender_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          active: boolean
          id: string
          role: string
          user_id: string
        }
        Insert: {
          active?: boolean
          id?: string
          role: string
          user_id: string
        }
        Update: {
          active?: boolean
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_reservation_table: {
        Args: { p_checkin?: boolean; p_id: string; p_table: string }
        Returns: undefined
      }
      staff_login_attempt: { Args: { p_key: string }; Returns: number }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
