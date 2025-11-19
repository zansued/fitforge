import React from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Brain } from "lucide-react";

export default function MoodTimeline({ entries, isLoading, onDelete }) {
  const moodEmojis = {
    muito_feliz: "😄",
    feliz: "🙂",
    neutro: "😐",
    triste: "😔",
    muito_triste: "😢",
    ansioso: "😰",
    estressado: "😫",
    calmo: "😌",
    energizado: "⚡",
    cansado: "😴"
  };

  const moodLabels = {
    muito_feliz: "Muito Feliz",
    feliz: "Feliz",
    neutro: "Neutro",
    triste: "Triste",
    muito_triste: "Muito Triste",
    ansioso: "Ansioso",
    estressado: "Estressado",
    calmo: "Calmo",
    energizado: "Energizado",
    cansado: "Cansado"
  };

  const moodColors = {
    muito_feliz: "bg-green-100 text-green-700 border-green-200",
    feliz: "bg-lime-100 text-lime-700 border-lime-200",
    neutro: "bg-gray-100 text-gray-700 border-gray-200",
    triste: "bg-blue-100 text-blue-700 border-blue-200",
    muito_triste: "bg-indigo-100 text-indigo-700 border-indigo-200",
    ansioso: "bg-yellow-100 text-yellow-700 border-yellow-200",
    estressado: "bg-red-100 text-red-700 border-red-200",
    calmo: "bg-teal-100 text-teal-700 border-teal-200",
    energizado: "bg-orange-100 text-orange-700 border-orange-200",
    cansado: "bg-purple-100 text-purple-700 border-purple-200"
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando registros...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum registro ainda</p>
          <p className="text-sm text-gray-400 mt-2">Comece registrando como você se sente hoje</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{moodEmojis[entry.mood]}</div>
                <div>
                  <CardTitle className="text-xl">
                    {format(new Date(entry.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${moodColors[entry.mood]} border`}>
                      {moodLabels[entry.mood]}
                    </Badge>
                    <Badge variant="outline">
                      Intensidade: {entry.intensity}/10
                    </Badge>
                    {entry.sleep_hours && (
                      <Badge variant="outline">
                        😴 {entry.sleep_hours}h
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(entry.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {entry.notes && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Notas:</h4>
                <p className="text-gray-600">{entry.notes}</p>
              </div>
            )}

            {entry.triggers && entry.triggers.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Gatilhos:</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.triggers.map((trigger, index) => (
                    <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.activities && entry.activities.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Atividades:</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.activities.map((activity, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.ai_insights && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Insights da IA</h4>
                </div>
                <div className="text-gray-700 prose prose-sm max-w-none">
                  <ReactMarkdown>{entry.ai_insights}</ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}