import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save, X, Loader2, Sparkles } from "lucide-react";

export default function MoodEntryForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date(),
    mood: "neutro",
    intensity: 5,
    notes: "",
    triggers: [],
    activities: [],
    sleep_hours: 7
  });
  const [triggerInput, setTriggerInput] = useState("");
  const [activityInput, setActivityInput] = useState("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

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

  const addTrigger = () => {
    if (triggerInput.trim()) {
      setFormData({
        ...formData,
        triggers: [...formData.triggers, triggerInput.trim()]
      });
      setTriggerInput("");
    }
  };

  const addActivity = () => {
    if (activityInput.trim()) {
      setFormData({
        ...formData,
        activities: [...formData.activities, activityInput.trim()]
      });
      setActivityInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsGeneratingInsights(true);
    
    try {
      const prompt = `Você é um psicólogo especializado em bem-estar mental. Analise o seguinte registro emocional e forneça insights construtivos e empáticos:

Data: ${format(new Date(formData.date), 'dd/MM/yyyy')}
Humor: ${moodLabels[formData.mood]}
Intensidade: ${formData.intensity}/10
Notas: ${formData.notes || "Sem observações"}
Gatilhos: ${formData.triggers.length > 0 ? formData.triggers.join(", ") : "Nenhum identificado"}
Atividades: ${formData.activities.length > 0 ? formData.activities.join(", ") : "Nenhuma registrada"}
Horas de sono: ${formData.sleep_hours}h

Forneça:
1. Uma análise empática do estado emocional
2. Possíveis conexões entre sono, atividades e humor
3. Sugestões práticas para melhorar o bem-estar
4. Técnicas de mindfulness ou coping se apropriado

Seja acolhedor, prático e motivador. Lembre que isso não substitui terapia profissional.`;

      const aiInsights = await base44.integrations.Core.InvokeLLM({
        prompt: prompt
      });

      const entryWithInsights = {
        ...formData,
        date: format(new Date(formData.date), 'yyyy-MM-dd'),
        ai_insights: aiInsights
      };

      onSave(entryWithInsights);
    } catch (error) {
      console.error("Erro ao gerar insights:", error);
      const entryWithoutInsights = {
        ...formData,
        date: format(new Date(formData.date), 'yyyy-MM-dd')
      };
      onSave(entryWithoutInsights);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Registro Emocional</DialogTitle>
        </DialogHeader>

        {isGeneratingInsights ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gerando insights...</h3>
            <p className="text-gray-600">A IA está analisando seu registro</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(formData.date), 'dd/MM/yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.date)}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Como você se sente? *</Label>
                <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(moodLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {moodEmojis[key]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Intensidade (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) || 5 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Horas de Sono</Label>
                <Input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas e Pensamentos</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Como foi seu dia? O que você sentiu?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Gatilhos ou Eventos</Label>
              <div className="flex gap-2">
                <Input
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  placeholder="Ex: reunião estressante"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTrigger())}
                />
                <Button type="button" onClick={addTrigger} variant="outline">+</Button>
              </div>
              {formData.triggers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.triggers.map((trigger, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {trigger}
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          triggers: formData.triggers.filter((_, i) => i !== index)
                        })}
                        className="text-purple-900 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Atividades Realizadas</Label>
              <div className="flex gap-2">
                <Input
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  placeholder="Ex: exercício, meditação"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addActivity())}
                />
                <Button type="button" onClick={addActivity} variant="outline">+</Button>
              </div>
              {formData.activities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.activities.map((activity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {activity}
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          activities: formData.activities.filter((_, i) => i !== index)
                        })}
                        className="text-blue-900 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}