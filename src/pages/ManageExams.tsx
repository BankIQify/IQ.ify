
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StandardExamForm } from "@/components/exams/StandardExamForm";
import { CustomExamForm } from "@/components/exams/CustomExamForm";

const ManageExams = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Exams</h1>
      
      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard">Standard Exams</TabsTrigger>
          <TabsTrigger value="custom">Custom Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <StandardExamForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <CustomExamForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageExams;
