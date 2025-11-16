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
      
      const prompt = `Você é um personal trainer especialista. Crie um exercício de musculação criativo e eficaz.

Características do exercício:
- Grupo muscular: ${categoryLabels[category]}
- Equipamento: ${equipmentLabels[equipment]}
- Dificuldade: ${difficulty}

Crie um exercício único (não os mais comuns), com:
1. Um nome criativo em português
2. Instruções detalhadas de execução (mínimo 5 passos)
3. Dicas importantes para maximizar resultados e evitar lesões

Seja criativo mas mantenha a segurança e eficácia.`;

      const exerciseData = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            name: { 
              type: "string",
              description: "Nome do exercício em português"
            },
            instructions: { 
              type: "string",
              description: "Instruções detalhadas passo a passo"
            },
            tips: { 
              type: "string",
              description: "Dicas importantes"
            }
          },
          required: ["name", "instructions", "tips"]
        }
      });

      console.log("Resposta da IA:", exerciseData);

      if (!exerciseData || !exerciseData.name || !exerciseData.instructions) {
        throw new Error("Dados incompletos retornados pela IA");
      }

      setGenerationStep("Salvando exercício...");

      const fullExercise = {
        name: exerciseData.name,
        category: category,
        equipment: equipment,
        difficulty: difficulty,
        instructions: exerciseData.instructions,
        tips: exerciseData.tips || "",
        image_url: "",
        video_url: ""
      };

      await base44.entities.Exercise.create(fullExercise);
      onGenerated();

    } catch (error) {
      console.error("Erro ao gerar exercício:", error);
      alert(`Erro: ${error.message || "Falha ao gerar exercício. Tente novamente."}`);
    } finally {
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
              Aguarde enquanto criamos seu exercício personalizado...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">
              Configure as características do exercício:
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