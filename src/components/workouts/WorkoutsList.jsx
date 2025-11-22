import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WorkoutsList({ workouts, isLoading, onToggleComplete }) {
  const [expandedId, setExpandedId] = React.useState(null);

  const typeColors = {
    forca: "bg-purple-100 text-purple-700 border-purple-200",
    cardio: "bg-blue-100 text-blue-700 border-blue-200",
    hiit: "bg-orange-100 text-orange-700 border-orange-200",
    funcional: "bg-green-100 text-green-700 border-green-200",
    alongamento: "bg-cyan-100 text-cyan-700 border-cyan-200",
    fullbody: "bg-pink-100 text-pink-700 border-pink-200"
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando treinos...</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum treino encontrado</p>
          <p className="text-sm text-gray-400 mt-2">Gere seu primeiro treino personalizado!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card 
          key={workout.id}
          className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1"
        >
          <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border-b border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => onToggleComplete(workout)}
                    className="flex-shrink-0 hover:scale-110 transition-transform"
                  >
                    {workout.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                  <CardTitle className={workout.completed ? "line-through text-gray-500" : ""}>
                    {workout.title}
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${typeColors[workout.type]} border-0 shadow-md`}>
                    {workout.type}
                  </Badge>
                  <Badge variant="outline" className="capitalize border-2 shadow-sm">
                    {workout.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workout.duration_minutes} min
                  </Badge>
                  {workout.completed_date && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      ✓ {format(new Date(workout.completed_date), "dd/MM/yyyy", { locale: ptBR })}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedId(expandedId === workout.id ? null : workout.id)}
              >
                {expandedId === workout.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>
          </CardHeader>

          {expandedId === workout.id && (
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Exercícios</h4>
              <div className="space-y-3">
                {workout.exercises?.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h5 className="font-medium mb-2">{exercise.name}</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Séries:</span>{" "}
                        <span className="font-semibold">{exercise.sets}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Reps:</span>{" "}
                        <span className="font-semibold">{exercise.reps}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Descanso:</span>{" "}
                        <span className="font-semibold">{exercise.rest_seconds}s</span>
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{exercise.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}