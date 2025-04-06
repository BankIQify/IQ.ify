import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedAchievement } from '@/components/achievements/AnimatedAchievement';

export const AchievementsTab = () => {
  useEffect(() => {
    console.log('AchievementsTab mounted');
    // Test if video file exists
    fetch('/achievements/Coming_Soon.mp4')
      .then(response => {
        console.log('Video file fetch response:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Video file is accessible');
      })
      .catch(error => {
        console.error('Error checking video file:', error);
      });
  }, []);

  console.log('AchievementsTab rendering');

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-[1472px] mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-iqify-navy">
            Achievement Showcase
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-4">
          <div className="w-full aspect-[1472/832] max-h-[832px] bg-muted/10 rounded-lg">
            <AnimatedAchievement
              src="/achievements/Coming_Soon.mp4"
              alt="Coming Soon Animation"
              className="w-full h-full object-contain"
              autoPlay
              loop
              onLoad={() => console.log('Video loaded successfully')}
              onError={() => console.error('Video failed to load')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
