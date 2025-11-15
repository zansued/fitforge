import { useState, useEffect } from "react";
import { UserProfile, Workout } from "@/entities/all";
import { User } from "@/entities/User";

import WelcomeHero from "../components/home/WelcomeHero";
import StatsGrid from "../components/home/StatsGrid";
import QuickActions from "../components/home/QuickActions";
import RecentWorkouts from "../components/home/RecentWorkouts";
import ProfileSetupPrompt from "../components/home/ProfileSetupPrompt";

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const allWorkouts = await Workout.filter({ created_by: currentUser.email }, "-created_date", 5);
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const completedWorkouts = workouts.filter(w => w.completed).length;
  const totalMinutes = workouts
    .filter(w => w.completed)
    .reduce((sum, w) => sum + (w.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen">
      <WelcomeHero user={user} profile={profile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {!profile ? (
          <ProfileSetupPrompt />
        ) : (
          <>
            <StatsGrid 
              completedWorkouts={completedWorkouts}
              totalMinutes={totalMinutes}
              weeklyGoal={profile.days_per_week}
              isLoading={isLoading}
            />

            <QuickActions profile={profile} />

            <RecentWorkouts workouts={workouts} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
}