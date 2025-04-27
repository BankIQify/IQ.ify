import { Card } from "@/components/ui/card";
import { StickyNote, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const DifferentiatorManager = () => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Differentiators</h3>
              <p className="text-sm text-muted-foreground">
                Manage unique features and differentiators
              </p>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Differentiator
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Example Differentiators */}
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Real-time Analytics</h4>
                  <div className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get instant insights into your data
                </p>
                <div className="mt-2">
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">AI Integration</h4>
                  <div className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Seamless AI-powered features
                </p>
                <div className="mt-2">
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Custom Reports</h4>
                  <div className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generate custom reports easily
                </p>
                <div className="mt-2">
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Differentiator Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Differentiator</h3>
        </div>
        <div className="grid gap-4">
          <Input placeholder="Feature Name" />
          <Input placeholder="Description" />
          <Button className="w-full">Add Differentiator</Button>
        </div>
      </Card>
    </div>
  );
};
