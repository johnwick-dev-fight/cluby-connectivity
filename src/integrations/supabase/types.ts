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
      applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          created_at: string
          id: string
          position_id: string
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          position_id: string
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          position_id?: string
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "recruitment_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          created_at: string
          id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          id?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          objectives: string | null
          representative_id: string
          social_links: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          objectives?: string | null
          representative_id: string
          social_links?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          objectives?: string | null
          representative_id?: string
          social_links?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          club_id: string
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          image_url: string | null
          location: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          club_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          club_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_flagged: boolean
          post_type: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          club_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_flagged?: boolean
          post_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          club_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_flagged?: boolean
          post_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          year?: string | null
        }
        Relationships: []
      }
      recruitment_positions: {
        Row: {
          application_deadline: string | null
          club_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          requirements: string | null
          responsibilities: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          club_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          requirements?: string | null
          responsibilities?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          club_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          requirements?: string | null
          responsibilities?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_positions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
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
