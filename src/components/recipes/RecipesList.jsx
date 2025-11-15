
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Flame, Heart } from "lucide-react";

export default function RecipesList({ recipes, isLoading, onSelectRecipe, onToggleFavorite }) {
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando receitas...</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhuma receita encontrada</p>
          <p className="text-sm text-gray-400 mt-2">Comece criando sua primeira receita!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer"
          onClick={() => onSelectRecipe(recipe)}
        >
          <div className="h-48 bg-gray-200 relative overflow-hidden">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500">
                <Flame className="w-16 h-16 text-white/50" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe);
              }}
            >
              <Heart
                className={`w-5 h-5 ${recipe.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
          </div>

          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
              {recipe.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {recipe.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${categoryColors[recipe.category]} border`}>
                {categoryLabels[recipe.category]}
              </Badge>
              {recipe.difficulty && (
                <Badge variant="outline" className="capitalize">
                  {recipe.difficulty}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{recipe.prep_time_minutes}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{recipe.servings} porções</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                <span>{recipe.calories_per_serving}cal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
