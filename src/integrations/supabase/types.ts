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
      exam_results: {
        Row: {
          completed_at: string | null
          created_at: string | null
          exam_id: string | null
          id: string
          score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          exam_id?: string | null
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          exam_id?: string | null
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sub_topics: {
        Row: {
          created_at: string | null
          exam_id: string | null
          id: string
          sub_topic_id: string | null
        }
        Insert: {
          created_at?: string | null
          exam_id?: string | null
          id?: string
          sub_topic_id?: string | null
        }
        Update: {
          created_at?: string | null
          exam_id?: string | null
          id?: string
          sub_topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_sub_topics_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_sub_topics_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          category: Database["public"]["Enums"]["question_category"] | null
          created_at: string | null
          id: string
          is_standard: boolean | null
          name: string
          question_count: number
          time_limit_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["question_category"] | null
          created_at?: string | null
          id?: string
          is_standard?: boolean | null
          name: string
          question_count: number
          time_limit_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"] | null
          created_at?: string | null
          id?: string
          is_standard?: boolean | null
          name?: string
          question_count?: number
          time_limit_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          name: string | null
          school: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          id: string
          name?: string | null
          school?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string | null
          school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_sections: {
        Row: {
          category: Database["public"]["Enums"]["question_category"]
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["question_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          ai_generated: boolean | null
          content: Json
          created_at: string | null
          difficulty: number | null
          generation_prompt: string | null
          id: string
          section_id: string | null
          sub_topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          content: Json
          created_at?: string | null
          difficulty?: number | null
          generation_prompt?: string | null
          id?: string
          section_id?: string | null
          sub_topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          content?: Json
          created_at?: string | null
          difficulty?: number | null
          generation_prompt?: string | null
          id?: string
          section_id?: string | null
          sub_topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "question_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_topics: {
        Row: {
          created_at: string | null
          id: string
          name: string
          section_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          section_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          section_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_topics_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "question_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      game_type:
        | "times_tables"
        | "memory_cards"
        | "chess"
        | "number_sequence"
        | "word_scramble"
        | "word_search"
        | "crossword"
        | "sudoku"
      question_category: "verbal" | "non_verbal" | "brain_training"
      user_role: "admin" | "user"
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
