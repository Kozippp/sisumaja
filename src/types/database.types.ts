export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          title: string
          slug: string
          description: string | null
          content: Json | null
          links: Json | null
          thumbnail_url: string | null
          media_gallery: Json
          youtube_url: string | null
          tiktok_url: string | null
          instagram_url: string | null
          stat_views: string | null
          stat_likes: string | null
          stat_comments: string | null
          stat_shares: string | null
          client_name: string | null
          client_role: string | null
          client_avatar_url: string | null
          client_quote: string | null
          is_visible: boolean
          published_at: string | null
          updated_at: string
          collaboration_completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          slug: string
          description?: string | null
          content?: Json | null
          links?: Json | null
          thumbnail_url?: string | null
          media_gallery?: Json
          youtube_url?: string | null
          tiktok_url?: string | null
          instagram_url?: string | null
          stat_views?: string | null
          stat_likes?: string | null
          stat_comments?: string | null
          stat_shares?: string | null
          client_name?: string | null
          client_role?: string | null
          client_avatar_url?: string | null
          client_quote?: string | null
          is_visible?: boolean
          published_at?: string | null
          updated_at?: string
          collaboration_completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          slug?: string
          description?: string | null
          content?: Json | null
          links?: Json | null
          thumbnail_url?: string | null
          media_gallery?: Json
          youtube_url?: string | null
          tiktok_url?: string | null
          instagram_url?: string | null
          stat_views?: string | null
          stat_likes?: string | null
          stat_comments?: string | null
          stat_shares?: string | null
          client_name?: string | null
          client_role?: string | null
          client_avatar_url?: string | null
          client_quote?: string | null
          is_visible?: boolean
          published_at?: string | null
          updated_at?: string
          collaboration_completed_at?: string | null
        }
      }
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          message: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          message: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
        }
      }
    }
  }
}

