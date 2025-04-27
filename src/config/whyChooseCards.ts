interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  mediaFolder: string;
  mediaFile: string | null;
  mediaType: 'image' | 'video' | null;
  order: number;
  layout: 'media-text' | 'text-media';
}

export const whyChooseCards: WhyChooseCard[] = [
  {
    id: 'card1',
    title: 'Strategic Thinking',
    description: 'Companies like McKinsey, Google, and Deloitte are on the hunt for employees who can think five steps ahead.\nOur Classic Strategy games — like Chess, Battleship, and Othello — sharpen planning, patience, and prediction.\nAdd in brain-training exams and non-verbal reasoning practice, and you\'ve got the perfect foundation for strategic mastery.\nAt IQify, we\'re not just testing memory — we\'re building minds that strategize.',
    mediaFolder: '/why-choose-cards/card1/media',
    mediaFile: null,
    mediaType: null,
    order: 0,
    layout: 'media-text'
  },
  {
    id: 'card2',
    title: 'Creative Problem Solving',
    description: 'Innovation isn\'t optional — it\'s essential. That\'s why Netflix, 3M, and Unilever value creative thinkers who solve complex problems with fresh ideas.\nIQify\'s Games of Life & Logic let you experiment, simulate, and think sideways.\nCombined with verbal reasoning and fast-paced decision drills, we help unlock your inner innovator.\nThis is brain training — with a twist.',
    mediaFolder: '/why-choose-cards/card2/media',
    mediaFile: null,
    mediaType: null,
    order: 1,
    layout: 'text-media'
  },
  {
    id: 'card3',
    title: 'Visual & Spatial Awareness',
    description: 'From engineering at Siemens to design thinking at IBM, visual reasoning is a critical edge.\nOur Visual & Spatial games — like Tetris-style stacks, Tangrams, and Rush Hour — build spatial logic and flexible perception.\nIt\'s not just about solving; it\'s about seeing solutions others miss.\nIQify sharpens the way you see, plan, and build.',
    mediaFolder: '/why-choose-cards/card3/media',
    mediaFile: null,
    mediaType: null,
    order: 2,
    layout: 'media-text'
  },
  {
    id: 'card4',
    title: 'Pattern Recognition & Memory',
    description: 'Pattern fluency is a secret weapon in tech, finance, and science — and companies like Pfizer, Mastercard, and Citigroup know it.\nOur Pattern & Matching games train you to recognize logic, rhythms, and visual memory faster than ever.\nPaired with exam-style reasoning questions, IQify turns pattern recognition into a superpower.\nReal learning, real recall — the IQify way.',
    mediaFolder: '/why-choose-cards/card4/media',
    mediaFile: null,
    mediaType: null,
    order: 3,
    layout: 'text-media'
  },
  {
    id: 'card5',
    title: 'Critical Thinking & Verbal Agility',
    description: 'The ability to reason clearly and communicate with insight is a prized skill at Netflix, Roche, and Accenture.\nIQify offers Word Games, quickfire verbal reasoning drills, and high-level brain teasers to refine sharp thinking.\nWhether it\'s exam prep or boardroom readiness, this is how the next generation trains.\nWords aren\'t just words — they\'re your edge.',
    mediaFolder: '/why-choose-cards/card5/media',
    mediaFile: null,
    mediaType: null,
    order: 4,
    layout: 'media-text'
  }
];
