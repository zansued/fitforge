import { useState, useEffect } from "react";
import { Workout, UserProfile } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

import WorkoutsList from "../components/workouts/WorkoutsList";
import WorkoutGenerator from "../components/workouts/WorkoutGenerator";
import WorkoutFilters from "../components/workouts/WorkoutFilters";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "all", completed: "all" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const allWorkouts = await Workout.filter({ created_by: currentUser.email }, "-created_date");
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
    }
    setIsLoading(false);
  };

  const handleWorkoutGenerated = async () => {
    setShowGenerator(false);
    await loadData();
  };

  const handleToggleComplete = async (workout) => {
    try {
      await Workout.update(workout.id, {
        completed: !workout.completed,
        completed_date: !workout.completed ? new Date().toISOString() : null
      });
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    const typeMatch = filters.type === "all" || workout.type === filters.type;
    const completedMatch = 
      filters.completed === "all" || 
      (filters.completed === "completed" && workout.completed) ||
      (filters.completed === "pending" && !workout.completed);
    return typeMatch && completedMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meus Treinos
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie seus treinos personalizados
            </p>
          </div>
          <Button
            onClick={() => setShowGenerator(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar Treino com IA
          </Button>
        </div>

        <WorkoutFilters filters={filters} onFilterChange={setFilters} />

        <WorkoutsList 
          workouts={filteredWorkouts}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
        />

        {showGenerator && profile && (
          <WorkoutGenerator
            profile={profile}
            onClose={() => setShowGenerator(false)}
            onGenerated={handleWorkoutGenerated}
          />
        )}
      </div>
    </div>
  );
}