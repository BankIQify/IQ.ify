
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/components/games/GameSettings";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trophy, Globe2, MapPin, Compass } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Country {
  name: string;
  capital: string;
  flag: string;
  flagUrl: string;
}

// For now using a small set of countries, this could be expanded based on difficulty
const COUNTRIES: Record<Difficulty, Country[]> = {
  easy: [
    { name: "France", capital: "Paris", flag: "🇫🇷", flagUrl: "https://flagcdn.com/w320/fr.png" },
    { name: "Spain", capital: "Madrid", flag: "🇪🇸", flagUrl: "https://flagcdn.com/w320/es.png" },
    { name: "Italy", capital: "Rome", flag: "🇮🇹", flagUrl: "https://flagcdn.com/w320/it.png" },
    { name: "Germany", capital: "Berlin", flag: "🇩🇪", flagUrl: "https://flagcdn.com/w320/de.png" },
    { name: "United Kingdom", capital: "London", flag: "🇬🇧", flagUrl: "https://flagcdn.com/w320/gb.png" },
  ],
  medium: [
    { name: "Japan", capital: "Tokyo", flag: "🇯🇵", flagUrl: "https://flagcdn.com/w320/jp.png" },
    { name: "Brazil", capital: "Brasília", flag: "🇧🇷", flagUrl: "https://flagcdn.com/w320/br.png" },
    { name: "Australia", capital: "Canberra", flag: "🇦🇺", flagUrl: "https://flagcdn.com/w320/au.png" },
    { name: "Canada", capital: "Ottawa", flag: "🇨🇦", flagUrl: "https://flagcdn.com/w320/ca.png" },
    { name: "India", capital: "New Delhi", flag: "🇮🇳", flagUrl: "https://flagcdn.com/w320/in.png" },
  ],
  hard: [
    { name: "Kazakhstan", capital: "Astana", flag: "🇰🇿", flagUrl: "https://flagcdn.com/w320/kz.png" },
    { name: "Uruguay", capital: "Montevideo", flag: "🇺🇾", flagUrl: "https://flagcdn.com/w320/uy.png" },
    { name: "Morocco", capital: "Rabat", flag: "🇲🇦", flagUrl: "https://flagcdn.com/w320/ma.png" },
    { name: "Vietnam", capital: "Hanoi", flag: "🇻🇳", flagUrl: "https://flagcdn.com/w320/vn.png" },
    { name: "Croatia", capital: "Zagreb", flag: "🇭🇷", flagUrl: "https://flagcdn.com/w320/hr.png" },
  ],
};

export const GeographyGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [countryGuess, setCountryGuess] = useState("");
  const [capitalGuess, setCapitalGuess] = useState("");
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [capitalOptions, setCapitalOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  }>({ show: false, isCorrect: false, message: "" });
  const [remainingCountries, setRemainingCountries] = useState<Country[]>([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number>(0);
  
  const { toast } = useToast();
  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
  });

  const getRandomCountries = (exclude: Country, count: number): Country[] => {
    const availableCountries = COUNTRIES[difficulty].filter(
      (c) => c.name !== exclude.name
    );
    const shuffled = [...availableCountries].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const generateOptions = (correct: Country) => {
    const wrongCountries = getRandomCountries(correct, 2);
    
    // Generate country options
    const countries = [correct.name, ...wrongCountries.map((c) => c.name)];
    setCountryOptions(countries.sort(() => Math.random() - 0.5));
    
    // Generate capital options
    const capitals = [correct.capital, ...wrongCountries.map((c) => c.capital)];
    setCapitalOptions(capitals.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    // Start with all countries for the current difficulty
    const shuffledCountries = [...COUNTRIES[difficulty]].sort(() => Math.random() - 0.5);
    setRemainingCountries(shuffledCountries);
    setAnsweredCorrectly(0);
    pickNextCountry(shuffledCountries);
    gameState.resetGame();
    gameState.startGame();
  };

  const pickNextCountry = (countries: Country[] = remainingCountries) => {
    if (countries.length === 0) {
      // Game complete
      handleGameComplete();
      return;
    }
    
    const nextCountry = countries[0];
    setCurrentCountry(nextCountry);
    setCountryGuess("");
    setCapitalGuess("");
    setFeedback({ show: false, isCorrect: false, message: "" });
    generateOptions(nextCountry);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCountry) return;

    const isCountryCorrect = countryGuess === currentCountry.name;
    const isCapitalCorrect = capitalGuess === currentCountry.capital;

    if (isCountryCorrect && isCapitalCorrect) {
      setFeedback({
        show: true,
        isCorrect: true,
        message: "Excellent! Both country and capital are correct!"
      });
      gameState.updateScore(10);
      setAnsweredCorrectly(prev => prev + 1);
    } else if (isCountryCorrect) {
      setFeedback({
        show: true,
        isCorrect: false,
        message: `The country is correct, but the capital is ${currentCountry.capital}.`
      });
      gameState.updateScore(5);
    } else if (isCapitalCorrect) {
      setFeedback({
        show: true,
        isCorrect: false,
        message: `The capital is correct, but the country is ${currentCountry.name}.`
      });
      gameState.updateScore(5);
    } else {
      setFeedback({
        show: true,
        isCorrect: false,
        message: `The correct answer was ${currentCountry.name} with capital ${currentCountry.capital}.`
      });
    }
    
    // Remove this country from the remaining countries
    setTimeout(() => {
      const newRemaining = remainingCountries.filter(c => c.name !== currentCountry.name);
      setRemainingCountries(newRemaining);
      
      if (newRemaining.length > 0) {
        pickNextCountry(newRemaining);
      } else {
        handleGameComplete();
      }
    }, 2000);
  };
  
  const handleGameComplete = () => {
    toast({
      title: "Geography Challenge Complete!",
      description: `You answered ${answeredCorrectly} out of ${COUNTRIES[difficulty].length} countries correctly. Your score: ${gameState.score}`,
    });
  };

  const totalCountries = COUNTRIES[difficulty].length;
  const progress = ((totalCountries - remainingCountries.length) / totalCountries) * 100;

  if (!currentCountry) return null;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-gradient-to-r from-pastel-blue/20 to-pastel-green/20 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            <span className="font-medium">Geography Challenge</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{gameState.score} points</span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mt-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>Question {totalCountries - remainingCountries.length + 1} of {totalCountries}</span>
          <span>{answeredCorrectly} correct</span>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="text-center p-6 bg-gradient-to-b from-pastel-blue/10 to-transparent">
          {currentCountry && (
            <div className="relative h-40 w-full mb-4 flex items-center justify-center">
              <img 
                src={currentCountry.flagUrl} 
                alt={`Flag of ${currentCountry.name}`}
                className="max-h-full max-w-full object-contain rounded-md shadow-md transform hover:scale-105 transition-transform"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Identify the country and its capital city
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span>Country</span>
            </div>
            <Select onValueChange={setCountryGuess} value={countryGuess} disabled={feedback.show}>
              <SelectTrigger className={cn(
                feedback.show && countryGuess === currentCountry.name ? "border-green-500 bg-green-50" : "",
                feedback.show && countryGuess !== currentCountry.name ? "border-red-500 bg-red-50" : ""
              )}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
              <Compass className="h-4 w-4" />
              <span>Capital City</span>
            </div>
            <Select onValueChange={setCapitalGuess} value={capitalGuess} disabled={feedback.show}>
              <SelectTrigger className={cn(
                feedback.show && capitalGuess === currentCountry.capital ? "border-green-500 bg-green-50" : "",
                feedback.show && capitalGuess !== currentCountry.capital ? "border-red-500 bg-red-50" : ""
              )}>
                <SelectValue placeholder="Select capital city" />
              </SelectTrigger>
              <SelectContent>
                {capitalOptions.map((capital) => (
                  <SelectItem key={capital} value={capital}>
                    {capital}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {feedback.show ? (
            <div className={cn(
              "p-4 rounded-lg animate-fade-in mt-4",
              feedback.isCorrect ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            )}>
              <p className="font-medium">{feedback.message}</p>
            </div>
          ) : (
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pastel-blue to-pastel-green hover:opacity-90 mt-4"
              disabled={!countryGuess || !capitalGuess}
            >
              Submit Answer
            </Button>
          )}
        </form>
      </Card>

      {remainingCountries.length === 0 && (
        <div className="bg-gradient-to-r from-pastel-green to-pastel-blue p-6 rounded-xl text-white shadow-md animate-scale-in">
          <div className="flex items-center gap-4">
            <Trophy className="h-12 w-12 text-yellow-300" />
            <div>
              <h3 className="text-2xl font-bold">Challenge Complete!</h3>
              <p>You answered {answeredCorrectly} out of {totalCountries} correctly.</p>
              <p className="text-white/90">Final score: {gameState.score} points</p>
            </div>
          </div>
          
          <Button
            onClick={initializeGame}
            className="w-full mt-6 bg-white text-primary hover:bg-white/90"
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};
