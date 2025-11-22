import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X } from "lucide-react";
import IngredientSelector from "./IngredientSelector";

export default function RecipeForm({ recipe, onSave, onCancel }) {
  const [formData, setFormData] = useState(recipe || {
    title: "",
    description: "",
    category: "",
    difficulty: "facil",
    prep_time_minutes: 30,
    servings: 2,
    calories_per_serving: 0,
    protein_grams: 0,
    carbs_grams: 0,
    fat_grams: 0,
    ingredients: [],
    instructions: [""],
    tags: [],
    image_url: ""
  });

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    formData.ingredients.forEach(ing => {
      if (ing.food_id && ing.quantity) {
        // Buscar dados do alimento
        base44.entities.Food.filter({ id: ing.food_id }).then(foods => {
          if (foods.length > 0) {
            const food = foods[0];
            const multiplier = ing.quantity / (food.serving_size || 100);
            totalCalories += (food.calories || 0) * multiplier;
            totalProtein += (food.protein_grams || 0) * multiplier;
            totalCarbs += (food.carbs_grams || 0) * multiplier;
            totalFat += (food.fat_grams || 0) * multiplier;
          }
        });
      }
    });

    setTimeout(() => {
      const servings = formData.servings || 1;
      setFormData(prev => ({
        ...prev,
        calories_per_serving: Math.round(totalCalories / servings),
        protein_grams: Math.round(totalProtein / servings),
        carbs_grams: Math.round(totalCarbs / servings),
        fat_grams: Math.round(totalFat / servings)
      }));
    }, 500);
  };



  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""]
    });
  };

  const removeInstruction = (index) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index)
    });
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({...formData, instructions: newInstructions});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      alert("Por favor, preencha os campos obrigatórios (Nome e Categoria)");
      return;
    }
    
    const cleanedIngredients = formData.ingredients.filter(i => i.food_id || i.food_name);
    const cleanedInstructions = formData.instructions.filter(i => i && i.trim());
    
    if (cleanedIngredients.length === 0) {
      alert("Adicione pelo menos um ingrediente");
      return;
    }
    
    if (cleanedInstructions.length === 0) {
      alert("Adicione pelo menos um passo no modo de preparo");
      return;
    }
    
    const cleanedData = {
      ...formData,
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions
    };
    onSave(cleanedData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? "Editar Receita" : "Nova Receita"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Nome da Receita *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Omelete proteico"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Breve descrição da receita"
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image_url">URL da Imagem (opcional)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cafe_da_manha">Café da Manhã</SelectItem>
                  <SelectItem value="almoco">Almoço</SelectItem>
                  <SelectItem value="jantar">Jantar</SelectItem>
                  <SelectItem value="lanche">Lanche</SelectItem>
                  <SelectItem value="pre_treino">Pré-Treino</SelectItem>
                  <SelectItem value="pos_treino">Pós-Treino</SelectItem>
                  <SelectItem value="sobremesa">Sobremesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prep_time">Tempo de Preparo (min)</Label>
              <Input
                id="prep_time"
                type="number"
                value={formData.prep_time_minutes}
                onChange={(e) => setFormData({...formData, prep_time_minutes: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">Porções</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calorias (por porção)</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories_per_serving}
                onChange={(e) => setFormData({...formData, calories_per_serving: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Proteínas (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.protein_grams}
                onChange={(e) => setFormData({...formData, protein_grams: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carboidratos (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.carbs_grams}
                onChange={(e) => setFormData({...formData, carbs_grams: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Gorduras (g)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.fat_grams}
                onChange={(e) => setFormData({...formData, fat_grams: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ingredientes da Biblioteca *</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={calculateNutrition}
              >
                Calcular Nutrição
              </Button>
            </div>
            <IngredientSelector
              ingredients={formData.ingredients}
              onChange={(ingredients) => setFormData({...formData, ingredients})}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Modo de Preparo *</Label>
              <Button type="button" size="sm" variant="outline" onClick={addInstruction}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-8 h-10 bg-purple-100 text-purple-700 rounded flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Passo ${index + 1}`}
                    rows={2}
                  />
                  {formData.instructions.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeInstruction(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Receita
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}