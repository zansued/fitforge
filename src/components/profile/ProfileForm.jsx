import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function ProfileForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    age: "",
    gender: "",
    weight: "",
    height: "",
    fitness_level: "",
    goal: "",
    days_per_week: 3,
    health_issues: "",
    preferences: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">Idade</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
            placeholder="Ex: 25"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
            placeholder="Ex: 70"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})}
            placeholder="Ex: 175"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitness_level">Nível de Condicionamento *</Label>
          <Select 
            value={formData.fitness_level} 
            onValueChange={(value) => setFormData({...formData, fitness_level: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iniciante">Iniciante</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Objetivo Principal *</Label>
          <Select value={formData.goal} onValueChange={(value) => setFormData({...formData, goal: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perder_peso">Perder Peso</SelectItem>
              <SelectItem value="ganhar_massa">Ganhar Massa Muscular</SelectItem>
              <SelectItem value="definir">Definir / Tonificar</SelectItem>
              <SelectItem value="melhorar_condicionamento">Melhorar Condicionamento</SelectItem>
              <SelectItem value="manter_forma">Manter a Forma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="days_per_week">Dias por Semana *</Label>
          <Input
            id="days_per_week"
            type="number"
            min="1"
            max="7"
            value={formData.days_per_week}
            onChange={(e) => setFormData({...formData, days_per_week: parseInt(e.target.value)})}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="health_issues">Problemas de Saúde ou Lesões</Label>
          <Textarea
            id="health_issues"
            value={formData.health_issues}
            onChange={(e) => setFormData({...formData, health_issues: e.target.value})}
            placeholder="Descreva qualquer problema de saúde, lesão ou limitação física..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        )}
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Perfil
        </Button>
      </div>
    </form>
  );
}