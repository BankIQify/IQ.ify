
import { Card, CardContent } from "@/components/ui/card";

export const NoSelectionView = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">No Questions Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a question set from the left to review and edit
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
