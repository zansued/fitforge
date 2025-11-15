import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Sparkles } from "lucide-react";

import ExerciseGrid from "../components/library/ExerciseGrid";
import ExerciseFilters from "../components/library/ExerciseFilters";
import ExerciseModal from "../components/library/ExerciseModal";
import ExerciseForm from "../components/library/ExerciseForm";
import ExerciseAIGenerator from "../components/library/ExerciseAIGenerator";

export default function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [filters, setFilters] = useState({ category: "all", difficulty: "all", equipment: "all" });
  
  const queryClient = useQueryClient();

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => base44.entities.Exercise.list("-created_date"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (newExercise) => base44.entities.Exercise.create(newExercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setShowForm(false);
      setEditingExercise(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Exercise.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setShowForm(false);
      setEditingExercise(null);
      setSelectedExercise(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Exercise.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setSelectedExercise(null);
    },
  });

  const handleSave = (data) => {
    if (editingExercise) {
      updateMutation.mutate({ id: editingExercise.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
    setSelectedExercise(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este exercício?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAIGenerated = () => {
    setShowAIGenerator(false);
    queryClient.invalidateQueries({ queryKey: ['exercises'] });
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
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAIGenerator(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar com IA
            </Button>
            <Button
              onClick={() => {
                setEditingExercise(null);
                setShowForm(true);
              }}
              variant="outline"
              className="shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {selectedExercise && (
          <ExerciseModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <ExerciseForm
            exercise={editingExercise}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingExercise(null);
            }}
          />
        )}

        {showAIGenerator && (
          <ExerciseAIGenerator
            onClose={() => setShowAIGenerator(false)}
            onGenerated={handleAIGenerated}
          />
        )}
      </div>
    </div>
  );
}