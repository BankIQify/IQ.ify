import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

import { revisionCards } from './data/revisionCards';
import { pastelColors } from './data/pastelColors';

const RevisionCard = ({ card, index }: { card: typeof revisionCards[0], index: number }) => {
  return (
    <div className="w-[300px] h-[380px] rounded-xl shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br" style={{
        background: pastelColors[index % pastelColors.length],
        mixBlendMode: 'multiply'
      }} />
      
      <div className="absolute top-4 left-4 right-4">
        <h3 className="text-lg font-cursive text-gray-700 whitespace-pre-wrap px-4 py-2 bg-white/50 rounded-lg text-center">
          {card.topText}
        </h3>
      </div>

      <div className="absolute top-1/4 bottom-0 left-4 right-4">
        <p className="font-sans text-base text-neutral-700 leading-relaxed text-center">
          <span dangerouslySetInnerHTML={{ __html: card.bottomText }} />
        </p>
      </div>
    </div>
  );
};

export const AboutIQify = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % revisionCards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-[1200px] px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About IQify</h2>
          <p className="text-lg text-gray-600 mb-8">
            IQify is dedicated to unlocking your full cognitive potential through scientifically proven methods. 
            Our global approach has empowered students across the globe to achieve exceptional academic success. 
            Explore how our approach can bridge the gap between potential and achievement.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <span>Learn More</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative h-[380px] w-full">
          <div className="relative w-[300px] h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <RevisionCard card={revisionCards[currentIndex]} index={currentIndex} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
