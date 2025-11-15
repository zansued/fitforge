import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Edit, Trash2 } from "lucide-react";

export default function ExerciseGrid({ exercises, isLoading, onSelectExercise, onEdit, onDelete }) {
  const categoryColors = {
    peito: "bg-purple-100 text-purple-700 border-purple-200",
    costas: "bg-blue-100 text-blue-700 border-blue-200",
    pernas: "bg-green-100 text-green-700 border-green-200",
    ombros: "bg-orange-100 text-orange-700 border-orange-200",
    bracos: "bg-pink-100 text-pink-700 border-pink-200",
    abdomen: "bg-cyan-100 text-cyan-700 border-cyan-200",
    cardio: "bg-red-100 text-red-700 border-red-200"
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando exercícios...</p>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum exercício encontrado</p>
          <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros ou adicione novos exercícios</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <Card
          key={exercise.id}
          className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
        >
          <div 
            className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden cursor-pointer"
            onClick={() => onSelectExercise(exercise)}
          >
            {exercise.image_url ? (
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Dumbbell className="w-16 h-16 text-white/50" />
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 
                className="font-bold text-lg group-hover:text-purple-600 transition-colors cursor-pointer flex-1"
                onClick={() => onSelectExercise(exercise)}
              >
                {exercise.name}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-purple-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(exercise);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(exercise.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {exercise.instructions}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${categoryColors[exercise.category]} border`}>
                {exercise.category}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {exercise.difficulty}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {exercise.equipment?.replace(/_/g, ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}