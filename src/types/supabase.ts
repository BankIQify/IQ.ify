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
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          type: 'trophy' | 'medal' | 'sticker'
          visual_asset: string
          created_at: string
          updated_at: string
          category?: string
          requirements?: Json
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'trophy' | 'medal' | 'sticker'
          visual_asset: string
          created_at?: string
          updated_at?: string
          category?: string
          requirements?: Json
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'trophy' | 'medal' | 'sticker'
          visual_asset?: string
          created_at?: string
          updated_at?: string
          category?: string
          requirements?: Json
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          progress: { current: number; target: number }
          unlocked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          progress?: { current: number; target: number }
          unlocked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          progress?: { current: number; target: number }
          unlocked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      achievement_streaks: {
        Row: {
          id: string
          user_id: string
          streak_type: string
          current_streak: number
          longest_streak: number
          last_activity_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_type: string
          current_streak?: number
          longest_streak?: number
          last_activity_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_type?: string
          current_streak?: number
          longest_streak?: number
          last_activity_at?: string
        }
      }
      subtopics: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          icon: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          icon?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_subtopic_performance: {
        Row: {
          id: string
          user_id: string
          subtopic_id: string
          score: number
          improvement_suggestions: string | null
          last_tested: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subtopic_id: string
          score: number
          improvement_suggestions?: string | null
          last_tested?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subtopic_id?: string
          score?: number
          improvement_suggestions?: string | null
          last_tested?: string
          created_at?: string
          updated_at?: string
        }
      }
      differentiators: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      update_achievement_progress: {
        Args: {
          p_user_id: string
          p_achievement_id: string
          p_progress: { current: number; target: number }
        }
        Returns: void
      }
      reorder_differentiators: {
        Args: {
          p_differentiator_id: string
          p_new_order: number
        }
        Returns: void
      }
    }
  }
} 