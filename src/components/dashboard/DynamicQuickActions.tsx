import { Link } from "react-router-dom";
import { Target, Brain, BookOpen, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface QuickAction {
  id: string;
  title: string;
  path: string;
  icon: keyof typeof iconComponents;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  accessCount: number;
}

// Map of icon names to components
const iconComponents = {
  Target,
  Brain,
  BookOpen,
  Award
};

// Default quick action (Practice Tests)
const defaultQuickAction: QuickAction = {
  id: 'practice-tests',
  title: 'Practice Tests',
  path: '/lets-practice',
  icon: 'Target',
  gradientFrom: 'from-green-50',
  gradientTo: 'to-teal-50',
  borderColor: 'border-green-200',
  textColor: 'text-green-700',
  iconColor: 'text-green-600',
  accessCount: 0
};

export const DynamicQuickActions = () => {
  const { user } = useAuthContext();

  const { data: quickActions = [defaultQuickAction] } = useQuery({
    queryKey: ['quickActions', user?.id],
    queryFn: async () => {
      if (!user) return [defaultQuickAction];

      try {
        const { data: activities, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('access_count', { ascending: false })
          .limit(4);

        if (error) throw error;

        if (!activities || activities.length === 0) {
          return [defaultQuickAction];
        }

        return activities.map((activity): QuickAction => ({
          id: activity.id,
          title: activity.title,
          path: activity.path,
          icon: activity.icon as keyof typeof iconComponents,
          gradientFrom: activity.gradient_from,
          gradientTo: activity.gradient_to,
          borderColor: activity.border_color,
          textColor: activity.text_color,
          iconColor: activity.icon_color,
          accessCount: activity.access_count
        }));
      } catch (error) {
        console.error('Error fetching quick actions:', error);
        return [defaultQuickAction];
      }
    },
    enabled: !!user
  });

  return (
    <Card className="bg-gradient-to-b from-green-50 to-teal-50 border-green-100">
      <CardHeader>
        <CardTitle className="text-lg text-green-700">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = iconComponents[action.icon] || Target;
          return (
            <Link key={action.id} to={action.path}>
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