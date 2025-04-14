import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Loader2, Search, SortAsc, SortDesc } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubTopic {
  id: string;
  name: string;
  questionCount: number;
}

interface Subject {
  id: string;
  name: string;
  totalQuestions: number;
  subtopics: SubTopic[];
}

interface SummaryStats {
  totalSubjects: number;
  totalSubtopics: number;
  totalQuestions: number;
  averageQuestionsPerSubject: number;
}

interface RawSubTopic {
  id: string;
  name: string;
  main_subject: string;
  questions: { id: string }[] | null;
}

export const DataInputDashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"name" | "questions">("questions");
  const [stats, setStats] = useState<SummaryStats>({
    totalSubjects: 0,
    totalSubtopics: 0,
    totalQuestions: 0,
    averageQuestionsPerSubject: 0,
  });

  useEffect(() => {
    const fetchQuestionCounts = async () => {
      try {
        setLoading(true);

        // Fetch subjects with their sub_topics
        const { data: rawSubTopics, error: subjectsError } = await supabase
          .from('sub_topics')
          .select(`
            id,
            name,
            main_subject,
            questions (
              id
            )
          `);

        if (subjectsError) {
          throw subjectsError;
        }

        // Process the data
        const subjectsWithCounts = (rawSubTopics as RawSubTopic[]).map(subject => ({
          id: subject.id,
          name: subject.name,
          mainSubject: subject.main_subject,
          questionCount: subject.questions?.length || 0
        }));

        // Group by main subject
        const groupedSubjects = subjectsWithCounts.reduce((acc, subject) => {
          if (!acc[subject.mainSubject]) {
            acc[subject.mainSubject] = {
              id: subject.mainSubject,
              name: subject.mainSubject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              totalQuestions: 0,
              subtopics: []
            };
          }
          
          acc[subject.mainSubject].subtopics.push({
            id: subject.id,
            name: subject.name,
            questionCount: subject.questionCount
          });
          
          acc[subject.mainSubject].totalQuestions += subject.questionCount;
          return acc;
        }, {} as Record<string, Subject>);

        const finalSubjects = Object.values(groupedSubjects);

        setSubjects(finalSubjects);
        setFilteredSubjects(finalSubjects);
        
        // Calculate summary statistics
        const totalSubjects = finalSubjects.length;
        const totalSubtopics = finalSubjects.reduce(
          (acc, subject) => acc + subject.subtopics.length,
          0
        );
        const totalQuestions = finalSubjects.reduce(
          (acc, subject) => acc + subject.totalQuestions,
          0
        );
        const averageQuestionsPerSubject = totalSubjects > 0
          ? Math.round(totalQuestions / totalSubjects)
          : 0;

        setStats({
          totalSubjects,
          totalSubtopics,
          totalQuestions,
          averageQuestionsPerSubject,
        });

      } catch (error) {
        console.error('Error fetching question counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionCounts();
  }, []);

  useEffect(() => {
    let filtered = [...subjects];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        subject =>
          subject.name.toLowerCase().includes(term) ||
          subject.subtopics.some(subtopic =>
            subtopic.name.toLowerCase().includes(term)
          )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc"
          ? a.totalQuestions - b.totalQuestions
          : b.totalQuestions - a.totalQuestions;
      }
    });

    setFilteredSubjects(filtered);
  }, [subjects, searchTerm, sortOrder, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subtopics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubtopics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Questions per Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageQuestionsPerSubject}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects or subtopics..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: "name" | "questions") => setSortBy(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Subject Name</SelectItem>
              <SelectItem value="questions">Question Count</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <span className="mr-2">{subject.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({subject.totalQuestions} questions)
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-4 space-y-2">
                  {subject.subtopics.map((subtopic) => (
                    <div
                      key={subtopic.id}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50"
                    >
                      <span className="text-sm font-medium">{subtopic.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {subtopic.questionCount} questions
                      </span>
                    </div>
                  ))}
                  {subject.subtopics.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No subtopics found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No subjects found matching your search
          </div>
        )}
      </div>
    </div>
  );
}; 