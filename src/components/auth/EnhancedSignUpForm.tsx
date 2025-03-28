import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { useAuthContext } from "@/contexts/AuthContext";
import { UsernameField } from "./UsernameField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FocusArea } from "@/types/auth/types";
import { DateSelector } from "@/components/ui/date-selector";

interface SignUpFormProps {
  onToggleMode: () => void;
  onGoogleSignIn: () => Promise<void>;
}

const EDUCATION_LEVELS = [
  "Not at school",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
  "University"
];

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Languages",
  "Coding",
  "Reasoning",
  "Problem Solving",
  "Critical Thinking",
  "Other"
];

const FOCUS_AREAS: { value: FocusArea; label: string }[] = [
  { value: "eleven_plus_prep", label: "Preparing for my 11+" },
  { value: "iq_improvement", label: "Improving my IQ and Cognitive Reasoning" },
  { value: "focus_improvement", label: "Helping improve my focus and concentration" },
  { value: "test_taking", label: "Develop my test-taking abilities" },
  { value: "problem_solving", label: "Improve my problem-solving skills" },
  { value: "time_management", label: "Improve my time management abilities during exams" },
  { value: "confidence_building", label: "Confidence building" }
];

export const EnhancedSignUpForm = ({ onToggleMode, onGoogleSignIn }: SignUpFormProps) => {
  const { signUp } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [otherSubject, setOtherSubject] = useState("");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<FocusArea[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSubjectToggle = (subject: string) => {
    if (subject === "Other") {
      if (!selectedSubjects.includes("Other")) {
        setSelectedSubjects(prev => [...prev, "Other"]);
      } else {
        setSelectedSubjects(prev => prev.filter(s => s !== "Other"));
        setOtherSubject("");
      }
    } else {
      setSelectedSubjects(prev => 
        prev.includes(subject) 
          ? prev.filter(s => s !== subject)
          : [...prev, subject]
      );
    }
  };

  const handleOtherSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherSubject(e.target.value);
  };

  const handleFocusAreaToggle = (area: FocusArea) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error:", error);
    let message = "An error occurred during authentication.";

    switch (error.message) {
      case "User already registered":
        message = "This email is already registered. Please sign in instead.";
        break;
      default:
        message = error.message;
    }

    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: message,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !username || !dateOfBirth || !country || !city || !educationLevel) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (selectedSubjects.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one subject",
      });
      return;
    }

    if (selectedSubjects.includes("Other") && !otherSubject.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please specify your other subject",
      });
      return;
    }

    if (selectedFocusAreas.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one focus area",
      });
      return;
    }

    setLoading(true);
    try {
      const subjectsToSubmit = selectedSubjects
        .filter(subject => subject !== "Other")
        .concat(selectedSubjects.includes("Other") && otherSubject.trim() ? [otherSubject] : []);

      await signUp(email, password, { 
        name: fullName,
        username,
        dateOfBirth,
        country,
        city,
        educationLevel,
        subjects: subjectsToSubmit,
        focus_areas: selectedFocusAreas,
        avatar_url: avatarUrl || `https://api.dicebear.com/9.x/micah/svg?seed=${username}`
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const generateAvatar = () => {
    const seed = username || Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/9.x/micah/svg?seed=${seed}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <DateSelector
          value={dateOfBirth}
          onChange={setDateOfBirth}
          disabled={loading}
          label=""
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          type="text"
          placeholder="Enter your country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="educationLevel">Education Level</Label>
        <Select value={educationLevel} onValueChange={setEducationLevel} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="Select your education level" />
          </SelectTrigger>
          <SelectContent>
            {EDUCATION_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Select Your Interests</Label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => (
            <Button
              key={subject}
              type="button"
              variant={selectedSubjects.includes(subject) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSubjectToggle(subject)}
              disabled={loading}
            >
              {subject}
            </Button>
          ))}
        </div>
        {selectedSubjects.includes("Other") && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Please specify your other subject"
              value={otherSubject}
              onChange={handleOtherSubjectChange}
              disabled={loading}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Select Your Focus Areas</Label>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map((area) => (
            <Button
              key={area.value}
              type="button"
              variant={selectedFocusAreas.includes(area.value) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFocusAreaToggle(area.value)}
              disabled={loading}
            >
              {area.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Username</Label>
        <UsernameField 
          value={username}
          onChange={setUsername}
          disabled={loading}
        />
      </div>

      {username && (
        <div className="space-y-2">
          <Label>Your Avatar</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No avatar
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={generateAvatar}
              disabled={loading}
            >
              Generate New Avatar
            </Button>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        variant="default"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onGoogleSignIn}
        disabled={loading}
      >
        Sign in with Google
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={onToggleMode}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
}; 