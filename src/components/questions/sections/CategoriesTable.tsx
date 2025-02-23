
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface CategoriesTableProps {
  sections?: any[];
}

export const CategoriesTable = ({ sections }: CategoriesTableProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Current Categories</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub-topics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections?.map((section) => (
            <TableRow key={section.id}>
              <TableCell className="font-medium">{section.name}</TableCell>
              <TableCell>{section.category}</TableCell>
              <TableCell>
                {section.sub_topics?.map((subTopic: any) => subTopic.name).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

