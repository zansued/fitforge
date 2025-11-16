import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

export default function ExerciseAIGenerator({ onClose, onGenerated }) {
  const [category, setCategory] = useState("peito");
  const [equipment, setEquipment] = useState("barra");
  const [difficulty, setDifficulty] = useState("intermediario");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  const categoryLabels = {
    peito: "Peito",
    costas: "Costas",
    pernas: "Pernas",
    ombros: "Ombros",
    bracos: "Braços",
    abdomen: "Abdômen",
    cardio: "Cardio"
  };

  const equipmentLabels = {
    barra: "Barra",
    halteres: "Halteres",
    maquina: "Máquina",
    peso_corporal: "Peso Corporal",
    cabo: "Cabo",
    kettlebell: "Kettlebell",
    nenhum: "Nenhum"
  };

  const generateExercise = async () => {
    setIsGenerating(true);
    
    try {
      setGenerationStep("Criando exercício...");
      
      const prompt = `Crie um exercício de musculação completo e detalhado com as seguintes características:
      
- Categoria (grupo muscular): ${categoryLabels[category]}
- Equipamento necessário: ${equipmentLabels[equipment]}
- Nível de dificuldade: ${difficulty}

O exercício deve ser:
- Único e criativo (não os mesmos exercícios tradicionais que todo mundo conhece)
- Seguro e anatomicamente correto
- Com instruções passo a passo muito detalhadas (pelo menos 5 passos)
- Com dicas importantes para execução correta

Forneça APENAS o JSON, sem texto adicional.`;

      const exerciseResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            instructions: { type: "string" },
            tips: { type: "string" }
          },
          required: ["name", "instructions"]
        }
      });

      if (!exerciseResponse || !exerciseResponse.name) {
        throw new Error("A IA não retornou um exercício válido.");
      }

      let imageUrl = "";
      try {
        setGenerationStep("Gerando imagem do exercício...");
        
        const imagePrompt = `Professional fitness photography of a person performing the exercise "${exerciseResponse.name}", correct form, modern gym, professional lighting, high quality`;
        const imageResponse = await base44.integrations.Core.GenerateImage({ 
          prompt: imagePrompt 
        });
        
        if (imageResponse && imageResponse.url) {
          imageUrl = imageResponse.url;
        }
      } catch (imageError) {
        console.error("Erro ao gerar imagem:", imageError);
      }

      const fullExercise = {
        name: exerciseResponse.name,
        category: category,
        equipment: equipment,
        difficulty: difficulty,
        instructions: exerciseResponse.instructions,
        tips: exerciseResponse.tips || "",
        image_url: imageUrl,
        video_url: ""
      };

      await base44.entities.Exercise.create(fullExercise);
      onGenerated();

    } catch (error) {
      console.error("Erro completo:", error);
      alert(`Erro ao gerar exercício: ${error.message || "Tente novamente"}`);
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Gerar Exercício com IA
          </DialogTitle>
        </DialogHeader>

        {isGenerating ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{generationStep}</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Aguarde enquanto a IA cria um exercício personalizado para você...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">
              Configure as características do exercício que você deseja gerar:
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Grupo Muscular</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peito">Peito</SelectItem>
                    <SelectItem value="costas">Costas</SelectItem>
                    <SelectItem value="pernas">Pernas</SelectItem>
                    <SelectItem value="ombros">Ombros</SelectItem>
                    <SelectItem value="bracos">Braços</SelectItem>
                    <SelectItem value="abdomen">Abdômen</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamento</Label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barra">Barra</SelectItem>
                    <SelectItem value="halteres">Halteres</SelectItem>
                    <SelectItem value="maquina">Máquina</SelectItem>
                    <SelectItem value="peso_corporal">Peso Corporal</SelectItem>
                    <SelectItem value="cabo">Cabo</SelectItem>
                    <SelectItem value="kettlebell">Kettlebell</SelectItem>
                    <SelectItem value="nenhum">Nenhum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={generateExercise}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Exercício
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}