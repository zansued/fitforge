import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

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
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Banana"
                required
              />
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