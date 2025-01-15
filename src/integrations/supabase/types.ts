export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      booking_steps_tracking: {
        Row: {
          booking_id: string | null
          completed: boolean | null
          created_at: string
          id: string
          session_id: string
          step: number
          step_name: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          completed?: boolean | null
          created_at?: string
          id?: string
          session_id: string
          step: number
          step_name: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          completed?: boolean | null
          created_at?: string
          id?: string
          session_id?: string
          step?: number
          step_name?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_steps_tracking_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cabin: string
          created_at: string
          date: string
          deleted_at: string | null
          duration: string
          group_size: string
          id: string
          invoice_url: string | null
          is_test_booking: boolean | null
          message: string | null
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string
          price: number
          promo_code_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          time_slot: string
          updated_at: string | null
          user_email: string
          user_id: string | null
          user_name: string
          user_phone: string
        }
        Insert: {
          cabin?: string
          created_at?: string
          date: string
          deleted_at?: string | null
          duration: string
          group_size: string
          id?: string
          invoice_url?: string | null
          is_test_booking?: boolean | null
          message?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string
          price: number
          promo_code_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          time_slot: string
          updated_at?: string | null
          user_email: string
          user_id?: string | null
          user_name: string
          user_phone: string
        }
        Update: {
          cabin?: string
          created_at?: string
          date?: string
          deleted_at?: string | null
          duration?: string
          group_size?: string
          id?: string
          invoice_url?: string | null
          is_test_booking?: boolean | null
          message?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string
          price?: number
          promo_code_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          time_slot?: string
          updated_at?: string | null
          user_email?: string
          user_id?: string | null
          user_name?: string
          user_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          content: Json
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          image_url: string | null
          is_published: boolean | null
          keywords: string[]
          meta_description: string
          meta_title: string
          slug: string
          template_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          keywords?: string[]
          meta_description: string
          meta_title: string
          slug: string
          template_type: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          keywords?: string[]
          meta_description?: string
          meta_title?: string
          slug?: string
          template_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          capacity: number
          city: string
          created_at: string
          deleted_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string
          updated_at: string
        }
        Insert: {
          address: string
          capacity: number
          city: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code: string
          updated_at?: string
        }
        Update: {
          address?: string
          capacity?: number
          city?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          phone_country_code: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          start_date: string | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at: string
          value: number | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          start_date?: string | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string
          value?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          start_date?: string | null
          type?: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      saved_bookings: {
        Row: {
          cabin: string
          created_at: string
          date: string
          deleted_at: string | null
          duration: string
          group_size: string
          id: string
          message: string | null
          time_slot: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cabin?: string
          created_at?: string
          date: string
          deleted_at?: string | null
          duration: string
          group_size: string
          id?: string
          message?: string | null
          time_slot: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cabin?: string
          created_at?: string
          date?: string
          deleted_at?: string | null
          duration?: string
          group_size?: string
          id?: string
          message?: string | null
          time_slot?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          session_id: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          session_id?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_schedule_format: {
        Args: {
          schedule: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "archived"
      promo_code_type: "percentage" | "fixed_amount" | "free"
      weekday:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
