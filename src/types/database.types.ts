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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          title: string
          title_en: string | null
          excerpt: string | null
          excerpt_en: string | null
          content: string | null
          content_en: string | null
          cover_image_url: string | null
          is_published: boolean | null
          published_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          slug: string
          title: string
          title_en?: string | null
          excerpt?: string | null
          excerpt_en?: string | null
          content?: string | null
          content_en?: string | null
          cover_image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          slug?: string
          title?: string
          title_en?: string | null
          excerpt?: string | null
          excerpt_en?: string | null
          content?: string | null
          content_en?: string | null
          cover_image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
        }
        Relationships: []
      }
      featured_videos: {
        Row: {
          id: string
          youtube_url: string
          youtube_video_id: string
          title: string
          thumbnail_url: string
          view_count: number
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
          last_synced_at: string | null
        }
        Insert: {
          id?: string
          youtube_url: string
          youtube_video_id: string
          title: string
          thumbnail_url: string
          view_count?: number
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
          last_synced_at?: string | null
        }
        Update: {
          id?: string
          youtube_url?: string
          youtube_video_id?: string
          title?: string
          thumbnail_url?: string
          view_count?: number
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
          last_synced_at?: string | null
        }
        Relationships: []
      }
      shorts_videos: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          is_mock: boolean
          display_order: number
          logo_scale: number | null
          logo_position_x: number | null
          logo_position_y: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          is_mock?: boolean
          display_order?: number
          logo_scale?: number | null
          logo_position_x?: number | null
          logo_position_y?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          is_mock?: boolean
          display_order?: number
          logo_scale?: number | null
          logo_position_x?: number | null
          logo_position_y?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      proposal_clients: {
        Row: {
          id: string
          company_name: string
          contact_name: string
          email: string
          phone: string | null
          billing_name: string | null
          billing_registry_code: string | null
          billing_vat_number: string | null
          billing_address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_name: string
          email: string
          phone?: string | null
          billing_name?: string | null
          billing_registry_code?: string | null
          billing_vat_number?: string | null
          billing_address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          contact_name?: string
          email?: string
          phone?: string | null
          billing_name?: string | null
          billing_registry_code?: string | null
          billing_vat_number?: string | null
          billing_address?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_catalog: {
        Row: {
          id: string
          code: string
          category: string
          title: string
          short_description: string | null
          long_description: string | null
          default_price_cents: number
          currency: string
          unit_label: string
          deliverables: unknown
          default_min_quantity: number
          default_max_quantity: number
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          category: string
          title: string
          short_description?: string | null
          long_description?: string | null
          default_price_cents?: number
          currency?: string
          unit_label?: string
          deliverables?: unknown
          default_min_quantity?: number
          default_max_quantity?: number
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          category?: string
          title?: string
          short_description?: string | null
          long_description?: string | null
          default_price_cents?: number
          currency?: string
          unit_label?: string
          deliverables?: unknown
          default_min_quantity?: number
          default_max_quantity?: number
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          id: string
          client_id: string
          title: string
          intro_text: string | null
          status: string
          access_token: string
          expires_at: string | null
          published_at: string | null
          first_opened_at: string | null
          last_opened_at: string | null
          currency: string
          vat_mode: string
          vat_rate: number
          guarantee_text: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          intro_text?: string | null
          status?: string
          access_token: string
          expires_at?: string | null
          published_at?: string | null
          first_opened_at?: string | null
          last_opened_at?: string | null
          currency?: string
          vat_mode?: string
          vat_rate?: number
          guarantee_text?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          intro_text?: string | null
          status?: string
          access_token?: string
          expires_at?: string | null
          published_at?: string | null
          first_opened_at?: string | null
          last_opened_at?: string | null
          currency?: string
          vat_mode?: string
          vat_rate?: number
          guarantee_text?: string | null
          internal_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "proposal_clients"
            referencedColumns: ["id"]
          }
        ]
      }
      proposal_items: {
        Row: {
          id: string
          proposal_id: string
          service_catalog_id: string | null
          category: string
          title: string
          description: string | null
          deliverables: unknown
          base_price_cents: number
          offered_price_cents: number
          currency: string
          unit_label: string
          billing_interval: string
          min_quantity: number
          max_quantity: number
          default_quantity: number
          is_enabled: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          service_catalog_id?: string | null
          category: string
          title: string
          description?: string | null
          deliverables?: unknown
          base_price_cents?: number
          offered_price_cents?: number
          currency?: string
          unit_label?: string
          billing_interval?: string
          min_quantity?: number
          max_quantity?: number
          default_quantity?: number
          is_enabled?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          service_catalog_id?: string | null
          category?: string
          title?: string
          description?: string | null
          deliverables?: unknown
          base_price_cents?: number
          offered_price_cents?: number
          currency?: string
          unit_label?: string
          billing_interval?: string
          min_quantity?: number
          max_quantity?: number
          default_quantity?: number
          is_enabled?: boolean
          display_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_items_proposal_id_fkey"
            columns: ["proposal_id"]
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          }
        ]
      }
      proposal_discount_rules: {
        Row: {
          id: string
          proposal_id: string
          label: string
          kind: string
          discount_type: string
          discount_value: number
          config: unknown
          min_quantity: number | null
          applicable_categories: string[] | null
          is_active: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          label: string
          kind: string
          discount_type: string
          discount_value?: number
          config?: unknown
          min_quantity?: number | null
          applicable_categories?: string[] | null
          is_active?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          label?: string
          kind?: string
          discount_type?: string
          discount_value?: number
          config?: unknown
          min_quantity?: number | null
          applicable_categories?: string[] | null
          is_active?: boolean
          display_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_discount_rules_proposal_id_fkey"
            columns: ["proposal_id"]
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          }
        ]
      }
      proposal_submissions: {
        Row: {
          id: string
          proposal_id: string
          kind: string
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          company_name: string | null
          message: string | null
          selected_items_snapshot: unknown
          totals_snapshot: unknown
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          kind: string
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          company_name?: string | null
          message?: string | null
          selected_items_snapshot?: unknown
          totals_snapshot?: unknown
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          kind?: string
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          company_name?: string | null
          message?: string | null
          selected_items_snapshot?: unknown
          totals_snapshot?: unknown
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_submissions_proposal_id_fkey"
            columns: ["proposal_id"]
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          client_avatar_url: string | null
          client_name: string | null
          client_quote: string | null
          client_quote_en: string | null
          client_review_stars: number | null
          client_review_title: string | null
          client_review_title_en: string | null
          client_role: string | null
          collaboration_completed_at: string | null
          content: Json | null
          content_en: Json | null
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          instagram_url: string | null
          is_visible: boolean | null
          links: Json | null
          links_en: Json | null
          media_gallery: Json | null
          project_type: 'youtube_ad' | 'shorts' | 'training'
          published_at: string | null
          show_youtube_stats: boolean | null
          show_on_frontpage_youtube: boolean | null
          show_on_frontpage_shorts: boolean | null
          slug: string
          stat_comments: string | null
          stat_likes: string | null
          stat_saves: string | null
          stat_shares: string | null
          stat_views: string | null
          thumbnail_url: string | null
          tiktok_url: string | null
          title: string
          title_en: string | null
          updated_at: string | null
          youtube_url: string | null
          youtube_video_id: string | null
        }
        Insert: {
          client_avatar_url?: string | null
          client_name?: string | null
          client_quote?: string | null
          client_quote_en?: string | null
          client_review_stars?: number | null
          client_review_title?: string | null
          client_review_title_en?: string | null
          client_role?: string | null
          collaboration_completed_at?: string | null
          content?: Json | null
          content_en?: Json | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          instagram_url?: string | null
          is_visible?: boolean | null
          links?: Json | null
          links_en?: Json | null
          media_gallery?: Json | null
          project_type?: 'youtube_ad' | 'shorts' | 'training'
          published_at?: string | null
          show_youtube_stats?: boolean | null
          show_on_frontpage_youtube?: boolean | null
          show_on_frontpage_shorts?: boolean | null
          slug: string
          stat_comments?: string | null
          stat_likes?: string | null
          stat_saves?: string | null
          stat_shares?: string | null
          stat_views?: string | null
          thumbnail_url?: string | null
          tiktok_url?: string | null
          title: string
          title_en?: string | null
          updated_at?: string | null
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          client_avatar_url?: string | null
          client_name?: string | null
          client_quote?: string | null
          client_quote_en?: string | null
          client_review_stars?: number | null
          client_review_title?: string | null
          client_review_title_en?: string | null
          client_role?: string | null
          collaboration_completed_at?: string | null
          content?: Json | null
          content_en?: Json | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          instagram_url?: string | null
          is_visible?: boolean | null
          links?: Json | null
          links_en?: Json | null
          media_gallery?: Json | null
          project_type?: 'youtube_ad' | 'shorts' | 'training'
          published_at?: string | null
          show_youtube_stats?: boolean | null
          show_on_frontpage_youtube?: boolean | null
          show_on_frontpage_shorts?: boolean | null
          slug?: string
          stat_comments?: string | null
          stat_likes?: string | null
          stat_saves?: string | null
          stat_shares?: string | null
          stat_views?: string | null
          thumbnail_url?: string | null
          tiktok_url?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string | null
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      social_stats: {
        Row: {
          id: string
          followers: string
          views: string
          updated_at: string
        }
        Insert: {
          id?: string
          followers?: string
          views?: string
          updated_at?: string
        }
        Update: {
          id?: string
          followers?: string
          views?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          type: "text" | "image"
          content: string | null
          author_name: string | null
          author_role: string | null
          author_company: string | null
          image_url: string | null
          status: "draft" | "published"
          order: number
          show_on_mobile: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          type: "text" | "image"
          content?: string | null
          author_name?: string | null
          author_role?: string | null
          author_company?: string | null
          image_url?: string | null
          status?: "draft" | "published"
          order?: number
          show_on_mobile?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          type?: "text" | "image"
          content?: string | null
          author_name?: string | null
          author_role?: string | null
          author_company?: string | null
          image_url?: string | null
          status?: "draft" | "published"
          order?: number
          show_on_mobile?: boolean
        }
        Relationships: []
      }
      youtube_ad_videos: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      retention_images: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          image_url: string
          is_active: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          image_url: string
          is_active?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          image_url?: string
          is_active?: boolean
          display_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
