export interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  features: any;
  differentiators: any;
  social_proof: any;
  testimonials: any;
  stats_cards: {
    id: string;
    highlight: string;
    supportingText: string;
  }[];
  created_at: string;
  updated_at: string;
} 