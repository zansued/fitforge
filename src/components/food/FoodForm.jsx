import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Sparkles, Loader2 } from "lucide-react";

export default function FoodForm({ food, onSave, onCancel }) {
  const [formData, setFormData] = useState(food || {
    name: "",
    description: "",
    category: "outros",
    serving_size: 100,
    calories: 0,
    protein_grams: 0,
    carbs_grams: 0,
    fat_grams: 0,
    fiber_grams: 0,
    image_url: "",
    benefits: ""
  });
  const [isSearching, setIsSearching] = useState(false);

  const searchFoodInfo = async () => {
    if (!formData.name.trim()) {
      alert("Digite o nome do alimento primeiro");
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Pesquise informações nutricionais precisas sobre o alimento "${formData.name}". 
Forneça dados para uma porção de 100g. Se não encontrar dados exatos, forneça estimativas baseadas em alimentos similares.
Inclua também uma breve descrição do alimento e seus principais benefícios para a saúde.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            description: { type: "string", description: "Breve descrição do alimento" },
            category: { 
              type: "string", 
              enum: ["frutas", "vegetais", "carnes", "peixes", "graos", "laticinios", "ovos", "oleaginosas", "leguminosas", "cereais", "temperos", "outros"]
            },
            calories: { type: "number", description: "Calorias por 100g" },
            protein_grams: { type: "number", description: "Proteínas em gramas por 100g" },
            carbs_grams: { type: "number", description: "Carboidratos em gramas por 100g" },
            fat_grams: { type: "number", description: "Gorduras em gramas por 100g" },
            fiber_grams: { type: "number", description: "Fibras em gramas por 100g" },
            benefits: { type: "string", description: "Principais benefícios para a saúde" }
          },
          required: ["calories", "protein_grams", "carbs_grams", "fat_grams"]
        }
      });

      if (response) {
        setFormData(prev => ({
          ...prev,
          description: response.description || prev.description,
          category: response.category || prev.category,
          serving_size: 100,
          calories: response.calories || 0,
          protein_grams: response.protein_grams || 0,
          carbs_grams: response.carbs_grams || 0,
          fat_grams: response.fat_grams || 0,
          fiber_grams: response.fiber_grams || 0,
          benefits: response.benefits || prev.benefits
        }));
      }
    } catch (error) {
      console.error("Erro ao pesquisar alimento:", error);
      alert("Erro ao pesquisar informações. Tente novamente.");
    }
    setIsSearching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{food ? "Editar Alimento" : "Novo Alimento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome do Alimento *</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Banana"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={searchFoodInfo}
                  disabled={isSearching || !formData.name.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Pesquisar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Digite o nome e clique em Pesquisar para preencher automaticamente</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Breve descrição do alimento"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frutas">Frutas</SelectItem>
                  <SelectItem value="vegetais">Vegetais</SelectItem>
                  <SelectItem value="carnes">Carnes</SelectItem>
                  <SelectItem value="peixes">Peixes</SelectItem>
                  <SelectItem value="graos">Grãos</SelectItem>
                  <SelectItem value="laticinios">Laticínios</SelectItem>
                  <SelectItem value="ovos">Ovos</SelectItem>
                  <SelectItem value="oleaginosas">Oleaginosas</SelectItem>
                  <SelectItem value="leguminosas">Leguminosas</SelectItem>
                  <SelectItem value="cereais">Cereais</SelectItem>
                  <SelectItem value="temperos">Temperos</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serving_size">Tamanho da Porção (g) *</Label>
              <Input
                id="serving_size"
                type="number"
                value={formData.serving_size}
                onChange={(e) => setFormData({...formData, serving_size: parseInt(e.target.value) || 0})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calorias *</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: parseFloat(e.target.value) || 0})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Proteínas (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={formData.protein_grams}
                onChange={(e) => setFormData({...formData, protein_grams: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carboidratos (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={formData.carbs_grams}
                onChange={(e) => setFormData({...formData, carbs_grams: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Gorduras (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={formData.fat_grams}
                onChange={(e) => setFormData({...formData, fat_grams: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiber">Fibras (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                value={formData.fiber_grams}
                onChange={(e) => setFormData({...formData, fiber_grams: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="benefits">Benefícios Nutricionais</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                placeholder="Descreva os principais benefícios deste alimento"
                rows={3}
              />
            </div>
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
      </DialogContent>
    </Dialog>
  );
}