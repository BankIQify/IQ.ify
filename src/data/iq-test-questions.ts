import type { Question } from "@/types/iq-test";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'numerical',
    question: "What number comes next in the sequence: 2, 4, 8, 16, ...",
    options: ["24", "32", "28", "30"],
    correctAnswer: "32",
    explanation: "Each number is doubled to get the next number in the sequence.",
    difficulty: "easy"
  },
  {
    id: 2,
    type: 'logical',
    question: "If all roses are flowers and some flowers fade quickly, then:",
    options: [
      "All roses fade quickly",
      "Some roses may fade quickly",
      "No roses fade quickly",
      "Roses never fade"
    ],
    correctAnswer: "Some roses may fade quickly",
    explanation: "This is a logical deduction. Since only some flowers fade quickly, and roses are flowers, we can only conclude that some roses MAY fade quickly.",
    difficulty: "easy"
  },
  {
    id: 3,
    type: 'pattern',
    question: "If ⭐️ = 5, 🌙 = 3, and ☀️ = 4, then ⭐️ + 🌙 + ☀️ = ?",
    options: ["10", "12", "15", "8"],
    correctAnswer: "12",
    explanation: "⭐️(5) + 🌙(3) + ☀️(4) = 12",
    difficulty: "easy"
  },
  {
    id: 4,
    type: 'numerical',
    question: "What number comes next: 1, 4, 9, 16, 25, ...",
    options: ["30", "36", "42", "49"],
    correctAnswer: "36",
    explanation: "These are square numbers: 1², 2², 3², 4², 5², 6²",
    difficulty: "medium"
  },
  {
    id: 5,
    type: 'pattern',
    question: "Complete the pattern: AABABC, AABABC, AAB...",
    options: ["ABC", "CAB", "BAC", "ACB"],
    correctAnswer: "ABC",
    explanation: "The pattern AABABC repeats, so after AAB comes ABC",
    difficulty: "medium"
  },
  {
    id: 6,
    type: 'logical',
    question: "All mammals are warm-blooded. No reptiles are mammals. Therefore:",
    options: [
      "All reptiles are cold-blooded",
      "Some reptiles are warm-blooded",
      "No warm-blooded animals are reptiles",
      "Some mammals are reptiles"
    ],
    correctAnswer: "No warm-blooded animals are reptiles",
    explanation: "Since all mammals are warm-blooded and no reptiles are mammals, we can deduce that no reptiles are warm-blooded animals.",
    difficulty: "hard"
  },
  {
    id: 7,
    type: 'analogy',
    question: "Bird is to Sky as Fish is to...",
    options: ["Water", "Land", "Tree", "Air"],
    correctAnswer: "Water",
    explanation: "Birds live and move in the sky, just as fish live and move in water. This is a relationship analogy.",
    difficulty: "easy"
  },
  {
    id: 8,
    type: 'spatial',
    question: "If a cube is unfolded, which of these patterns could it make?",
    options: [
      "T shape with 4 squares in a row and 2 on sides",
      "Plus sign with equal squares",
      "L shape with 6 squares",
      "Square with squares on each side"
    ],
    correctAnswer: "Plus sign with equal squares",
    explanation: "A cube has 6 equal faces. When unfolded properly, it can form a plus sign shape with equal squares.",
    difficulty: "medium"
  },
  {
    id: 9,
    type: 'verbal',
    question: "Choose the word that DOES NOT belong in this group: Swift, Quick, Fast, Rapid, Sluggish",
    options: ["Swift", "Quick", "Sluggish", "Rapid"],
    correctAnswer: "Sluggish",
    explanation: "All words except 'Sluggish' are synonyms meaning fast or speedy. 'Sluggish' means slow or lazy.",
    difficulty: "easy"
  },
  {
    id: 10,
    type: 'pattern',
    question: "What comes next in the pattern: 🔴 🔵 🔵 🔴 🔵 🔵 ...",
    options: ["🔴", "🔵", "⚫", "⚪"],
    correctAnswer: "🔴",
    explanation: "The pattern repeats: red, blue, blue. After two blue circles, a red circle follows.",
    difficulty: "easy"
  },
  {
    id: 11,
    type: 'spatial',
    question: "If you fold a paper in half twice, then punch a hole in the center, how many holes will there be when you unfold it?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "4",
    explanation: "When folded twice, the paper has 4 layers. A hole punched through all layers will create 4 holes when unfolded.",
    difficulty: "medium"
  },
  {
    id: 12,
    type: 'analogy',
    question: "Book is to Page as Album is to...",
    options: ["Music", "Song", "Artist", "Record"],
    correctAnswer: "Song",
    explanation: "A book is made up of pages, just as an album is made up of songs. This is a part-to-whole relationship.",
    difficulty: "medium"
  },
  {
    id: 13,
    type: 'verbal',
    question: "Which word is the odd one out: Painting, Drawing, Sculpture, Gallery, Sketch",
    options: ["Painting", "Drawing", "Gallery", "Sketch"],
    correctAnswer: "Gallery",
    explanation: "Gallery is a place where art is displayed, while all other words are types of artwork or artistic creations.",
    difficulty: "hard"
  },
  {
    id: 14,
    type: 'logical',
    question: "If no cats like water, and some pets are cats, then:",
    options: [
      "All pets hate water",
      "Some pets don't like water",
      "No pets like water",
      "Some pets might like water"
    ],
    correctAnswer: "Some pets don't like water",
    explanation: "Since some pets are cats, and no cats like water, we can conclude that at least some pets (the cats) don't like water.",
    difficulty: "hard"
  }
];
