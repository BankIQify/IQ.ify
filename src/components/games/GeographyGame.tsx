
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/components/games/GameSettings";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Country {
  name: string;
  capital: string;
  flag: string;
}

// For now using a small set of countries, this could be expanded based on difficulty
const COUNTRIES: Record<Difficulty, Country[]> = {
  easy: [
    { name: "France", capital: "Paris", flag: "🇫🇷" },
    { name: "Spain", capital: "Madrid", flag: "🇪🇸" },
    { name: "Italy", capital: "Rome", flag: "🇮🇹" },
    { name: "Germany", capital: "Berlin", flag: "🇩🇪" },
    { name: "United Kingdom", capital: "London", flag: "🇬🇧" },
  ],
  medium: [
    { name: "Japan", capital: "Tokyo", flag: "🇯🇵" },
    { name: "Brazil", capital: "Brasília", flag: "🇧🇷" },
    { name: "Australia", capital: "Canberra", flag: "🇦🇺" },
    { name: "Canada", capital: "Ottawa", flag: "🇨🇦" },
    { name: "India", capital: "New Delhi", flag: "🇮🇳" },
  ],
  hard: [
    { name: "Kazakhstan", capital: "Astana", flag: "🇰🇿" },
    { name: "Uruguay", capital: "Montevideo", flag: "🇺🇾" },
    { name: "Morocco", capital: "Rabat", flag: "🇲🇦" },
    { name: "Vietnam", capital: "Hanoi", flag: "🇻🇳" },
    { name: "Croatia", capital: "Zagreb", flag: "🇭🇷" },
  ],
};

export const GeographyGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [countryGuess, setCountryGuess] = useState("");
  const [capitalGuess, setCapitalGuess] = useState("");
  const [score, setScore] = useState(0);
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [capitalOptions, setCapitalOptions] = useState<string[]>([]);
  const { toast } = useToast();

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
    pickRandomCountry();
  }, [difficulty]);

  const pickRandomCountry = () => {
    const countries = COUNTRIES[difficulty];
    const randomIndex = Math.floor(Math.random() * countries.length);
    const selected = countries[randomIndex];
    setCurrentCountry(selected);
    setCountryGuess("");
    setCapitalGuess("");
    generateOptions(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCountry) return;

    const isCountryCorrect = countryGuess === currentCountry.name;
    const isCapitalCorrect = capitalGuess === currentCountry.capital;

    if (isCountryCorrect && isCapitalCorrect) {
      toast({
        title: "Correct!",
        description: "You identified both the country and its capital!",
      });
      setScore(score + 2);
      pickRandomCountry();
    } else if (isCountryCorrect) {
      toast({
        title: "Partially Correct",
        description: "Country is correct, but the capital is wrong.",
        variant: "default",
      });
      setScore(score + 1);
    } else if (isCapitalCorrect) {
      toast({
        title: "Partially Correct",
        description: "Capital is correct, but the country is wrong.",
        variant: "default",
      });
      setScore(score + 1);
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${currentCountry.name} with capital ${currentCountry.capital}.`,
        variant: "destructive",
      });
    }
  };

  if (!currentCountry) return null;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="text-8xl mb-8">{currentCountry.flag}</div>
        <p className="text-sm text-muted-foreground mb-4">
          Identify the country and its capital city
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Select onValueChange={setCountryGuess} value={countryGuess}>
            <SelectTrigger className="w-full">
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
          <Select onValueChange={setCapitalGuess} value={capitalGuess}>
            <SelectTrigger className="w-full">
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

        <Button type="submit" className="w-full">
          Submit Answer
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Score: {score} points
        </p>
      </div>
    </div>
  );
};

