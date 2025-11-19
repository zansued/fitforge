import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Heart, Apple } from "lucide-react";

export default function FoodDetails({ food, onClose, onEdit, onDelete, onToggleFavorite }) {
  const categoryColors = {
    frutas: "bg-pink-100 text-pink-700 border-pink-200",
    vegetais: "bg-green-100 text-green-700 border-green-200",
    carnes: "bg-red-100 text-red-700 border-red-200",
    peixes: "bg-blue-100 text-blue-700 border-blue-200",
    graos: "bg-amber-100 text-amber-700 border-amber-200",
    laticinios: "bg-purple-100 text-purple-700 border-purple-200",
    ovos: "bg-yellow-100 text-yellow-700 border-yellow-200",
    oleaginosas: "bg-orange-100 text-orange-700 border-orange-200",
    leguminosas: "bg-lime-100 text-lime-700 border-lime-200",
    cereais: "bg-cyan-100 text-cyan-700 border-cyan-200",
    temperos: "bg-emerald-100 text-emerald-700 border-emerald-200",
    outros: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const categoryLabels = {
    frutas: "Frutas",
    vegetais: "Vegetais",
    carnes: "Carnes",
    peixes: "Peixes",
    graos: "Grãos",
    laticinios: "Laticínios",
    ovos: "Ovos",
    oleaginosas: "Oleaginosas",
    leguminosas: "Leguminosas",
    cereais: "Cereais",
    temperos: "Temperos",
    outros: "Outros"
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl">{food.name}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(food)}
                className={food.is_favorite ? "text-red-500" : ""}
              >
                <Heart className={`w-5 h-5 ${food.is_favorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(food)}
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(food.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {food.image_url ? (
            <img
              src={food.image_url}
              alt={food.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Apple className="w-24 h-24 text-white/50" />
            </div>
          )}

          <div className="flex gap-2">
            <Badge className={`${categoryColors[food.category]} border`}>
              {categoryLabels[food.category]}
            </Badge>
          </div>

          {food.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Descrição</h3>
              <p className="text-gray-600">{food.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-4">Informação Nutricional</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-4">Por {food.serving_size}g</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{food.calories}</p>
                  <p className="text-sm text-gray-600">Calorias</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{food.protein_grams || 0}g</p>
                  <p className="text-sm text-gray-600">Proteínas</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{food.carbs_grams || 0}g</p>
                  <p className="text-sm text-gray-600">Carboidratos</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">{food.fat_grams || 0}g</p>
                  <p className="text-sm text-gray-600">Gorduras</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{food.fiber_grams || 0}g</p>
                  <p className="text-sm text-gray-600">Fibras</p>
                </div>
              </div>
            </div>
          </div>

          {food.benefits && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Benefícios</h3>
              <p className="text-gray-600 whitespace-pre-line">{food.benefits}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}