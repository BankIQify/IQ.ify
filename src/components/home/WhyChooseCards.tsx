'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from 'react';

interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  mediaPath: string;
}

const whyChooseCards: WhyChooseCard[] = [
  {
    id: 'card1',
    title: 'Strategic Thinking',
    description: `Companies like McKinsey, Google, and Deloitte are on the hunt for employees who can think five steps ahead.
Our Classic Strategy games — like Chess, Battleship, and Othello — sharpen planning, patience, and prediction.
Add in brain-training exams and non-verbal reasoning practice, and you've got the perfect foundation for strategic mastery.
At IQify, we're not just testing memory — we're building minds that strategize.`,
    mediaPath: '/why-choose-cards/card1/media/card1.mp4'
  },
  {
    id: 'card2',
    title: 'Creative Problem Solving',
    description: `Innovation isn't optional — it's essential. That's why Netflix, 3M, and Unilever value creative thinkers who solve complex problems with fresh ideas.
IQify's Games of Life & Logic let you experiment, simulate, and think sideways.
Combined with verbal reasoning and fast-paced decision drills, we help unlock your inner innovator.
This is brain training — with a twist.`,
    mediaPath: '/why-choose-cards/card2/media/card2.mp4'
  },
  {
    id: 'card3',
    title: 'Visual & Spatial Awareness',
    description: `From engineering at Siemens to design thinking at IBM, visual reasoning is a critical edge.
Our Visual & Spatial games — like Tetris-style stacks, Tangrams, and Rush Hour — build spatial logic and flexible perception.
It's not just about solving; it's about seeing solutions others miss.
IQify sharpens the way you see, plan, and build.`,
    mediaPath: '/why-choose-cards/card3/media/card3.mp4'
  },
  {
    id: 'card4',
    title: 'Pattern Recognition & Memory',
    description: `Pattern fluency is a secret weapon in tech, finance, and science — and companies like Pfizer, Mastercard, and Citigroup know it.
Our Pattern & Matching games train you to recognize logic, rhythms, and visual memory faster than ever.
Paired with exam-style reasoning questions, IQify turns pattern recognition into a superpower.
Real learning, real recall — the IQify way.`,
    mediaPath: '/why-choose-cards/card4/media/card4.mp4'
  },
  {
    id: 'card5',
    title: 'Critical Thinking & Verbal Agility',
    description: `The ability to reason clearly and communicate with insight is a prized skill at Netflix, Roche, and Accenture.
IQify offers Word Games, quickfire verbal reasoning drills, and high-level brain teasers to refine sharp thinking.
Whether it's exam prep or boardroom readiness, this is how the next generation trains.
Words aren't just words — they're your edge.`,
    mediaPath: '/why-choose-cards/card5/media/card5.mp4'
  }
];

const WhyChooseCard = ({ card, index }: { card: WhyChooseCard, index: number }) => {
  const [error, setError] = useState(false);
  const isLeftLayout = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <Card className="flex flex-col md:flex-row gap-8 items-center">
        {isLeftLayout ? (
          <>
            <div className="flex-1">
              <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video">
                <video
                  src={error ? '/default-card-image.png' : card.mediaPath}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setError(true)}
                />
                {error && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white">Media not available</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </div>
            <div className="flex-1">
              <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video">
                <video
                  src={error ? '/default-card-image.png' : card.mediaPath}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setError(true)}
                />
                {error && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white">Media not available</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export const WhyChooseCards = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose IQify?</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover how IQify prepares you for success in the world's most innovative companies
        </p>
      </div>
      <div className="space-y-12">
        {whyChooseCards.map((card, index) => (
          <WhyChooseCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
};
