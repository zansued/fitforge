import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame, Heart, Edit, Trash2 } from "lucide-react";

export default function RecipeDetails({ recipe, onClose, onEdit, onDelete, onToggleFavorite }) {
  const categoryColors = {
    cafe_da_manha: "bg-yellow-100 text-yellow-700 border-yellow-200",
    almoco: "bg-green-100 text-green-700 border-green-200",
    jantar: "bg-blue-100 text-blue-700 border-blue-200",
    lanche: "bg-purple-100 text-purple-700 border-purple-200",
    pre_treino: "bg-orange-100 text-orange-700 border-orange-200",
    pos_treino: "bg-pink-100 text-pink-700 border-pink-200",
    sobremesa: "bg-rose-100 text-rose-700 border-rose-200"
  };

  const categoryLabels = {
    cafe_da_manha: "Café da Manhã",
    almoco: "Almoço",
    jantar: "Jantar",
    lanche: "Lanche",
    pre_treino: "Pré-Treino",
    pos_treino: "Pós-Treino",
    sobremesa: "Sobremesa"
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl pr-12">{recipe.title}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(recipe)}
              >
                <Heart
                  className={`w-5 h-5 ${recipe.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(recipe)}
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(recipe.id)}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {recipe.image_url && (
            <div className="w-full h-64 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {recipe.description && (
            <p className="text-gray-700">{recipe.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge className={`${categoryColors[recipe.category]} border`}>
              {categoryLabels[recipe.category]}
            </Badge>
            {recipe.difficulty && (
              <Badge variant="outline" className="capitalize">
                {recipe.difficulty}
              </Badge>
            )}
            {recipe.tags?.map((tag, idx) => (
              <Badge key={idx} variant="outline">{tag}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Clock className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Preparo</p>
              <p className="font-semibold">{recipe.prep_time_minutes} min</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Users className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Porções</p>
              <p className="font-semibold">{recipe.servings}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Flame className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Calorias</p>
              <p className="font-semibold">{recipe.calories_per_serving}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <span className="text-purple-600 font-bold text-xl mb-2 block">P</span>
              <p className="text-xs text-gray-600">Proteínas</p>
              <p className="font-semibold">{recipe.protein_grams}g</p>
            </div>
          </div>

          {recipe.carbs_grams > 0 || recipe.fat_grams > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Informações Nutricionais (por porção)</h4>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-600">Proteínas</p>
                  <p className="font-semibold">{recipe.protein_grams}g</p>
                </div>
                <div>
                  <p className="text-gray-600">Carboidratos</p>
                  <p className="font-semibold">{recipe.carbs_grams}g</p>
                </div>
                <div>
                  <p className="text-gray-600">Gorduras</p>
                  <p className="font-semibold">{recipe.fat_grams}g</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm">
                  ✓
                </span>
                Ingredientes
              </h4>
              <ul className="space-y-2 bg-gray-50 rounded-lg p-4">
                {recipe.ingredients?.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm">
                  📝
                </span>
                Modo de Preparo
              </h4>
              <ol className="space-y-3 bg-gray-50 rounded-lg p-4">
                {recipe.instructions?.map((instruction, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}