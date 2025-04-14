export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  background_image?: string;
  rating: number;
  active_users: number;
  award_text: string;
  bubble_text: string;
  primary_button_text: string;
  secondary_button_text: string;
  cta_button?: {
    text: string;
    url: string;
    variant: 'primary';
  };
  secondary_button?: {
    text: string;
    url: string;
    variant: 'secondary';
  };
  created_at: string;
  updated_at: string;
}

export interface HeroContentUpdate {
  title?: string;
  subtitle?: string;
  description?: string;
  background_image?: string;
  rating?: number;
  active_users?: number;
  award_text?: string;
  bubble_text?: string;
  primary_button_text?: string;
  secondary_button_text?: string;
  cta_button?: {
    text: string;
    url: string;
    variant: 'primary';
  };
  secondary_button?: {
    text: string;
    url: string;
    variant: 'secondary';
  };
} 