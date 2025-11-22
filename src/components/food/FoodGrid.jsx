import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Apple, Edit, Trash2, Heart } from "lucide-react";

export default function FoodGrid({ foods, isLoading, onSelectFood, onEdit, onDelete, onToggleFavorite }) {
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando alimentos...</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <Apple className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum alimento encontrado</p>
          <p className="text-sm text-gray-400 mt-2">Adicione alimentos ou ajuste os filtros</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foods.map((food) => (
        <Card
          key={food.id}
          className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden hover:scale-[1.03] hover:-translate-y-1"
        >
          <div 
            className="h-40 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden cursor-pointer"
            onClick={() => onSelectFood(food)}
          >
            {food.image_url ? (
              <img
                src={food.image_url}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Apple className="w-16 h-16 text-white/50" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 h-8 w-8 ${food.is_favorite ? 'text-red-500' : 'text-white'} hover:scale-110`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(food);
              }}
            >
              <Heart className={`w-5 h-5 ${food.is_favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 
                className="font-bold text-lg group-hover:text-purple-600 transition-colors cursor-pointer flex-1"
                onClick={() => onSelectFood(food)}
              >
                {food.name}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(food);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(food.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Badge className={`${categoryColors[food.category]} border-0 shadow-md mb-3`}>
              {categoryLabels[food.category]}
            </Badge>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-purple-50 rounded p-2">
                <p className="text-gray-600 text-xs">Calorias</p>
                <p className="font-bold text-purple-700">{food.calories} kcal</p>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <p className="text-gray-600 text-xs">Proteína</p>
                <p className="font-bold text-blue-700">{food.protein_grams || 0}g</p>
              </div>
              <div className="bg-green-50 rounded p-2">
                <p className="text-gray-600 text-xs">Carbos</p>
                <p className="font-bold text-green-700">{food.carbs_grams || 0}g</p>
              </div>
              <div className="bg-orange-50 rounded p-2">
                <p className="text-gray-600 text-xs">Gordura</p>
                <p className="font-bold text-orange-700">{food.fat_grams || 0}g</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Por {food.serving_size}g
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}