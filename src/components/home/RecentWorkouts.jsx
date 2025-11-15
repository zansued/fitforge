import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RecentWorkouts({ workouts, isLoading }) {
  const typeColors = {
    forca: "bg-purple-100 text-purple-700",
    cardio: "bg-blue-100 text-blue-700",
    hiit: "bg-orange-100 text-orange-700",
    funcional: "bg-green-100 text-green-700",
    alongamento: "bg-cyan-100 text-cyan-700",
    fullbody: "bg-pink-100 text-pink-700"
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Treinos Recentes</h2>
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle>Últimos Treinos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : workouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum treino encontrado</p>
              <p className="text-sm text-gray-400 mt-2">Comece gerando seu primeiro treino!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {workout.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{workout.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{workout.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={typeColors[workout.type] || "bg-gray-100 text-gray-700"}>
                        {workout.type}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {workout.duration_minutes} min
                      </Badge>
                    </div>
                  </div>
                  {workout.completed_date && (
                    <div className="text-xs text-gray-500 flex-shrink-0">
                      {format(new Date(workout.completed_date), "dd/MM", { locale: ptBR })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}