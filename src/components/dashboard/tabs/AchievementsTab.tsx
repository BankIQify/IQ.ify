
import { UserBadges } from "@/components/dashboard/UserBadges";
import { AchievementsSummary } from "@/components/dashboard/AchievementsSummary";

export const AchievementsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UserBadges />
      <AchievementsSummary />
    </div>
  );
};
