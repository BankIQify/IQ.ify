
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TableSelectorProps {
  selectedTables: number[];
  onToggleTable: (table: number) => void;
}

/**
 * TableSelector component provides a grid of checkboxes for selecting
 * which times tables to practice (1-25).
 */
export const TableSelector = ({
  selectedTables,
  onToggleTable,
}: TableSelectorProps) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: 25 }, (_, i) => i + 1).map((table) => (
        <div key={table} className="flex items-center space-x-2">
          <Checkbox
            id={`table-${table}`}
            checked={selectedTables.includes(table)}
            onCheckedChange={() => onToggleTable(table)}
          />
          <Label htmlFor={`table-${table}`}>{table}×</Label>
        </div>
      ))}
    </div>
  );
};
