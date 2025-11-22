import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export default function WorkoutGenerator({ profile, onClose, onGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkout = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Crie um treino de academia personalizado para uma pessoa com as seguintes características:
      
- Nível: ${profile.fitness_level}
- Objetivo: ${profile.goal}
- Dias por semana: ${profile.days_per_week}
${profile.health_issues ? `- Restrições: ${profile.health_issues}` : ''}

Crie um treino completo e detalhado, apropriado para o nível e objetivo da pessoa.
Inclua 6-8 exercícios variados com séries, repetições e tempo de descanso.
O treino deve durar entre 45-60 minutos.`;

      const schema = await base44.entities.Workout.schema();
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: schema
      });

      await base44.entities.Workout.create(response);
      onGenerated();
    } catch (error) {
      console.error("Erro ao gerar treino:", error);
      alert("Erro ao gerar treino. Tente novamente.");
    }
    setIsGenerating(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Gerar Treino Personalizado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Seu Perfil:</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Nível:</span> <span className="font-medium capitalize">{profile.fitness_level}</span></p>
              <p><span className="text-gray-600">Objetivo:</span> <span className="font-medium capitalize">{profile.goal?.replace(/_/g, ' ')}</span></p>
              <p><span className="text-gray-600">Frequência:</span> <span className="font-medium">{profile.days_per_week}x por semana</span></p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Vamos usar inteligência artificial para criar um treino personalizado perfeito para você, baseado no seu perfil e objetivos.
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={generateWorkout}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Treino
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}