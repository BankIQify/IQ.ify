import { Link } from "react-router-dom";
import { Target, Brain, BookOpen, Award, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type QuickAction } from "@/types/activity/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';

interface QuickActionsProps {
  userId: string;
}

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Target,
  Brain,
  BookOpen,
  Award
};

// Default quick action for new users
const defaultQuickAction: QuickAction = {
  type: 'practice_test',
  title: 'Practice Tests',
  icon: 'Target',
  path: '/lets-practice',
  gradientFrom: 'from-green-50',
  gradientTo: 'to-teal-50',
  borderColor: 'border-green-200',
  textColor: 'text-green-700',
  iconColor: 'text-green-600'
};

export const QuickActions = ({ userId }: QuickActionsProps) => {
  // Fetch user's most frequently used actions
  const { data: quickActions = [] } = useQuery<QuickAction[]>({
    queryKey: ['quickActions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('access_count', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching quick actions:', error);
        return [defaultQuickAction];
      }

      // Map the database results to QuickAction type
      const actions = data.map((activity): QuickAction => ({
        type: activity.type,
        title: activity.title,
        icon: activity.icon,
        path: activity.path,
        gradientFrom: activity.gradient_from,
        gradientTo: activity.gradient_to,
        borderColor: activity.border_color,
        textColor: activity.text_color,
        iconColor: activity.icon_color
      }));

      // If no activities yet, return default action
      return actions.length > 0 ? actions : [defaultQuickAction];
    },
    initialData: [defaultQuickAction]
  });

  return (
    <Card className="bg-gradient-to-b from-green-50 to-teal-50 border-green-100">
      <CardHeader>
        <CardTitle className="text-lg text-green-700">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = iconMap[action.icon] || Target;
          return (
            <Link key={action.path + index} to={action.path}>
              <Button 
                variant="outline" 
                className={`w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-r ${action.gradientFrom} ${action.gradientTo} border-2 ${action.borderColor} hover:bg-opacity-75 hover:border-opacity-75 transition-all transform hover:scale-105 ${action.textColor}`}
              >
                <Icon className={`h-8 w-8 ${action.iconColor}`} />
                <span className="text-base font-medium">{action.title}</span>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}; 