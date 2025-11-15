import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, Lightbulb } from "lucide-react";

export default function ExerciseModal({ exercise, onClose }) {
  const categoryColors = {
    peito: "bg-purple-100 text-purple-700 border-purple-200",
    costas: "bg-blue-100 text-blue-700 border-blue-200",
    pernas: "bg-green-100 text-green-700 border-green-200",
    ombros: "bg-orange-100 text-orange-700 border-orange-200",
    bracos: "bg-pink-100 text-pink-700 border-pink-200",
    abdomen: "bg-cyan-100 text-cyan-700 border-cyan-200",
    cardio: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {exercise.image_url && (
            <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg overflow-hidden">
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

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

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Instruções</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{exercise.instructions}</p>
            </div>

            {exercise.tips && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Dicas</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{exercise.tips}</p>
              </div>
            )}

            {exercise.video_url && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Vídeo Demonstrativo</h3>
                <a
                  href={exercise.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Assistir vídeo →
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}