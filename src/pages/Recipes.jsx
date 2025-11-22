import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";

import RecipeOfTheDay from "../components/recipes/RecipeOfTheDay";
import RecipesList from "../components/recipes/RecipesList";
import RecipeFilters from "../components/recipes/RecipeFilters";
import RecipeForm from "../components/recipes/RecipeForm";
import RecipeDetails from "../components/recipes/RecipeDetails";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({ category: "all", difficulty: "all", favorite: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const allRecipes = await base44.entities.Recipe.filter({ created_by: currentUser.email }, "-created_date");
      setRecipes(allRecipes);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    }
    setIsLoading(false);
  };

  const handleSaveRecipe = async (data) => {
    try {
      if (editingRecipe) {
        await base44.entities.Recipe.update(editingRecipe.id, data);
      } else {
        await base44.entities.Recipe.create(data);
      }
      await loadData();
      setShowForm(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;
    try {
      await base44.entities.Recipe.delete(recipeId);
      await loadData();
      setSelectedRecipe(null);
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
    }
  };

  const handleToggleFavorite = async (recipe) => {
    try {
      await base44.entities.Recipe.update(recipe.id, {
        is_favorite: !recipe.is_favorite
      });
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
    setSelectedRecipe(null);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const categoryMatch = filters.category === "all" || recipe.category === filters.category;
    const difficultyMatch = filters.difficulty === "all" || recipe.difficulty === filters.difficulty;
    const favoriteMatch = !filters.favorite || recipe.is_favorite;
    return categoryMatch && difficultyMatch && favoriteMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Receitas Saudáveis
            </h1>
            <p className="text-gray-600 mt-2">
              Alimentação balanceada para seus objetivos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRecipe(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        </div>

        <RecipeOfTheDay profile={profile} onRecipeSaved={loadData} />

        <div className="mt-8">
          <RecipeFilters filters={filters} onFilterChange={setFilters} />

          <RecipesList
            recipes={filteredRecipes}
            isLoading={isLoading}
            onSelectRecipe={setSelectedRecipe}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {showForm && (
          <RecipeForm
            recipe={editingRecipe}
            onSave={handleSaveRecipe}
            onCancel={() => {
              setShowForm(false);
              setEditingRecipe(null);
            }}
          />
        )}

        {selectedRecipe && (
          <RecipeDetails
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={handleEdit}
            onDelete={handleDeleteRecipe}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
    </div>
  );
}