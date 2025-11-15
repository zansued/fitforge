import { useState, useEffect } from "react";
import { Exercise } from "@/entities/all";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import ExerciseGrid from "../components/library/ExerciseGrid";
import ExerciseFilters from "../components/library/ExerciseFilters";
import ExerciseModal from "../components/library/ExerciseModal";

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filters, setFilters] = useState({ category: "all", difficulty: "all", equipment: "all" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setIsLoading(true);
    try {
      const allExercises = await Exercise.list("-created_date");
      setExercises(allExercises);
    } catch (error) {
      console.error("Erro ao carregar exercícios:", error);
    }
    setIsLoading(false);
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.instructions?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "all" || exercise.category === filters.category;
    const matchesDifficulty = filters.difficulty === "all" || exercise.difficulty === filters.difficulty;
    const matchesEquipment = filters.equipment === "all" || exercise.equipment === filters.equipment;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Biblioteca de Exercícios
            </h1>
            <p className="text-gray-600 mt-2">
              Explore e aprenda novos exercícios
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200"
            />
          </div>
        </div>

        <ExerciseFilters filters={filters} onFilterChange={setFilters} />

        <ExerciseGrid 
          exercises={filteredExercises}
          isLoading={isLoading}
          onSelectExercise={setSelectedExercise}
        />

        {selectedExercise && (
          <ExerciseModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </div>
    </div>
  );
}