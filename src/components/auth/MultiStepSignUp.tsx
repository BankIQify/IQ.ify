import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FocusArea } from "@/types/auth/types";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { AvatarCustomizer } from "./AvatarCustomizer";

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
  { value: "confidence_building", label: "Build my confidence" }
];

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

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

interface FormData {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  country: string;
  city: string;
  educationLevel: string;
  subjects: string[];
  focusAreas: FocusArea[];
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  password: "",
  dateOfBirth: {
    day: "",
    month: "",
    year: ""
  },
  country: "",
  city: "",
  educationLevel: "",
  subjects: [],
  focusAreas: []
};

interface MultiStepSignUpProps {
  onToggleMode: () => void;
  onGoogleSignIn: () => Promise<void>;
}

export const MultiStepSignUp = ({ onToggleMode, onGoogleSignIn }: MultiStepSignUpProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [otherSubject, setOtherSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof FormData['dateOfBirth'], value: string) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [field]: value }
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleFocusAreaToggle = (area: FocusArea) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const steps = [
    {
      title: "Enter Your Login Info",
      component: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent"
            />
          </div>
        </motion.div>
      )
    },
    {
      title: "Tell Us About Yourself",
      component: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={formData.dateOfBirth.day}
                onValueChange={(value) => handleDateChange('day', value)}
              >
                <SelectTrigger className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.dateOfBirth.month}
                onValueChange={(value) => handleDateChange('month', value)}
              >
                <SelectTrigger className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.dateOfBirth.year}
                onValueChange={(value) => handleDateChange('year', value)}
              >
                <SelectTrigger className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleInputChange('country', value)}
            >
              <SelectTrigger className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB] bg-transparent">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="rounded-xl bg-white/10 border-neon-green focus:border-bright-pink"
            />
          </div>
          <div className="space-y-2">
            <Label>Education Level</Label>
            <Select
              value={formData.educationLevel}
              onValueChange={(value) => handleInputChange('educationLevel', value)}
            >
              <SelectTrigger className="rounded-xl bg-white/10 border-neon-green">
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" className="max-h-[200px]">
                {EDUCATION_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Select Your Interests</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SUBJECTS.map(subject => (
                <motion.button
                  key={subject}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.subjects.includes(subject)
                      ? 'text-bright-pink border-2 border-bright-pink shadow-lg shadow-bright-pink/30'
                      : 'text-[#1EAEDB] border-2 border-[#1EAEDB]/20 hover:border-[#1EAEDB]/40'
                  }`}
                  onClick={() => handleSubjectToggle(subject)}
                >
                  {subject}
                </motion.button>
              ))}
            </div>
            {formData.subjects.includes("Other") && (
              <Input
                type="text"
                placeholder="Please specify your other subject"
                value={otherSubject}
                onChange={(e) => setOtherSubject(e.target.value)}
                className="rounded-xl border-2 border-[#1EAEDB]/20 focus:border-bright-pink text-[#1EAEDB]"
              />
            )}
          </div>

          <div className="space-y-4">
            <Label>Select Your Focus Areas</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FOCUS_AREAS.map(area => (
                <motion.button
                  key={area.value}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.focusAreas.includes(area.value)
                      ? 'text-neon-green border-2 border-neon-green shadow-lg shadow-neon-green/30'
                      : 'text-[#1EAEDB] border-2 border-[#1EAEDB]/20 hover:border-[#1EAEDB]/40'
                  }`}
                  onClick={() => handleFocusAreaToggle(area.value)}
                >
                  {area.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: "Create Your Avatar",
      component: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-display text-[#1EAEDB] mb-2">Design Your Avatar</h3>
            <p className="text-sm text-gray-600">Create a fun avatar that represents you!</p>
          </div>
          <AvatarCustomizer />
        </motion.div>
      )
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-white to-[rgba(30,174,219,0.02)]">
      {/* Background Bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* ... existing bubble code ... */}
      </div>

      {/* Logo */}
      <Link to="/" className="absolute top-6 left-6 z-10">
        <Logo className="w-12 h-auto drop-shadow-lg" />
      </Link>

      {/* Content */}
      <div className="relative z-10 w-full px-4 pt-20">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <div className="w-full md:w-2/3">
            <AnimatePresence mode="wait">
              {steps[currentStep - 1].component}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="rounded-xl bg-transparent border-[#1EAEDB]/20 text-[#1EAEDB] hover:bg-[#1EAEDB]/5"
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="rounded-xl bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/90"
              >
                {currentStep === 3 ? "Complete Sign Up" : "Next"}
              </Button>
            </div>

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
          </div>

          <div className="hidden md:block w-1/3">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${
                    currentStep === index + 1 ? 'text-[#1EAEDB]' : 'text-[#1EAEDB]/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep === index + 1
                        ? 'bg-[#1EAEDB] text-white scale-110'
                        : 'bg-[#1EAEDB]/10'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 