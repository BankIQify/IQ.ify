
export interface WordClue {
  word: string;
  clue: string;
}

// Word lists for different themes
export const wordLists: Record<string, WordClue[]> = {
  general: [
    { word: "APPLE", clue: "Red or green fruit" },
    { word: "BOOK", clue: "Reading material with pages" },
    { word: "CAT", clue: "Small feline pet" },
    { word: "DOG", clue: "Man's best friend" },
    { word: "EARTH", clue: "Our planet" },
    { word: "FISH", clue: "Aquatic creature with fins" },
    { word: "GAME", clue: "Activity played for fun" },
    { word: "HOUSE", clue: "Place to live" },
    { word: "ICE", clue: "Frozen water" },
    { word: "JUMP", clue: "To leap or spring upward" },
    { word: "KEY", clue: "Used to open a lock" },
    { word: "LAMP", clue: "Light source" },
    { word: "MUSIC", clue: "Combination of sounds in harmony" },
    { word: "NIGHT", clue: "Opposite of day" },
    { word: "OCEAN", clue: "Large body of saltwater" },
    { word: "PENCIL", clue: "Writing tool with lead" },
    { word: "QUEEN", clue: "Female monarch" },
    { word: "RIVER", clue: "Natural flowing watercourse" },
    { word: "SUN", clue: "Star at the center of our solar system" },
    { word: "TABLE", clue: "Furniture with a flat top and legs" },
    { word: "UMBRELLA", clue: "Protection from rain" },
    { word: "WINDOW", clue: "Opening in a wall to let in light" },
    { word: "XYLOPHONE", clue: "Musical instrument with wooden bars" },
    { word: "YELLOW", clue: "Color of a lemon" },
    { word: "ZOO", clue: "Collection of animals for public viewing" }
  ],
  animals: [
    { word: "TIGER", clue: "Large striped wild cat" },
    { word: "ELEPHANT", clue: "Largest land mammal with a trunk" },
    { word: "GIRAFFE", clue: "Long-necked African animal" },
    { word: "DOLPHIN", clue: "Intelligent marine mammal" },
    { word: "PENGUIN", clue: "Flightless bird that swims well" },
    { word: "KANGAROO", clue: "Australian marsupial that hops" },
    { word: "ZEBRA", clue: "African equid with black and white stripes" },
    { word: "LION", clue: "King of the jungle" },
    { word: "MONKEY", clue: "Primate that climbs trees" },
    { word: "BEAR", clue: "Large mammal that hibernates" },
    { word: "SNAKE", clue: "Legless reptile" },
    { word: "FROG", clue: "Amphibian that croaks" },
    { word: "WHALE", clue: "Largest marine mammal" },
    { word: "OWL", clue: "Nocturnal bird of prey" },
    { word: "FOX", clue: "Small wild canine with bushy tail" }
  ],
  science: [
    { word: "ATOM", clue: "Smallest unit of an element" },
    { word: "GRAVITY", clue: "Force that attracts objects to Earth" },
    { word: "ENERGY", clue: "Capacity to do work" },
    { word: "CELL", clue: "Basic unit of life" },
    { word: "DNA", clue: "Genetic material in all living organisms" },
    { word: "PLANET", clue: "Celestial body orbiting a star" },
    { word: "PHOTON", clue: "Particle of light" },
    { word: "MOLECULE", clue: "Group of atoms bonded together" },
    { word: "EVOLUTION", clue: "Process of biological change over time" },
    { word: "NEWTON", clue: "Unit of force, or famous physicist" },
    { word: "OXYGEN", clue: "Element we breathe" },
    { word: "CARBON", clue: "Element found in all organic compounds" },
    { word: "QUANTUM", clue: "Smallest discrete unit of a physical property" },
    { word: "THEORY", clue: "Well-substantiated explanation" },
    { word: "BIOLOGY", clue: "Study of living organisms" }
  ],
  food: [
    { word: "PIZZA", clue: "Italian dish with cheese and toppings" },
    { word: "PASTA", clue: "Italian staple made from flour and water" },
    { word: "SUSHI", clue: "Japanese dish often containing raw fish" },
    { word: "BREAD", clue: "Baked food made from flour" },
    { word: "CHEESE", clue: "Dairy product made from milk curds" },
    { word: "TACO", clue: "Mexican dish with folded tortilla" },
    { word: "SOUP", clue: "Liquid food served hot in a bowl" },
    { word: "BURGER", clue: "Sandwich with a patty" },
    { word: "SALAD", clue: "Dish of mixed vegetables" },
    { word: "RICE", clue: "Grain that's a staple food for many cultures" },
    { word: "CAKE", clue: "Sweet baked dessert" },
    { word: "CHOCOLATE", clue: "Sweet food made from cacao beans" },
    { word: "COFFEE", clue: "Caffeinated beverage from roasted beans" },
    { word: "FRUIT", clue: "Edible plant product with seeds" },
    { word: "VEGETABLE", clue: "Plant or part of a plant used as food" }
  ],
  geography: [
    { word: "MOUNTAIN", clue: "Large landform that rises steeply" },
    { word: "RIVER", clue: "Natural flowing watercourse" },
    { word: "OCEAN", clue: "Large body of saltwater" },
    { word: "DESERT", clue: "Arid land with little precipitation" },
    { word: "ISLAND", clue: "Land mass surrounded by water" },
    { word: "CONTINENT", clue: "Large landmass on Earth" },
    { word: "COUNTRY", clue: "Nation with its own government" },
    { word: "CITY", clue: "Large urban center" },
    { word: "CANYON", clue: "Deep ravine between cliffs" },
    { word: "VALLEY", clue: "Low area between hills or mountains" },
    { word: "EQUATOR", clue: "Imaginary line dividing Earth into Northern and Southern Hemispheres" },
    { word: "GLACIER", clue: "Slowly moving mass of ice" },
    { word: "PENINSULA", clue: "Land area mostly surrounded by water" },
    { word: "PLAIN", clue: "Flat or gently rolling land" },
    { word: "FOREST", clue: "Large area covered with trees" }
  ]
};
