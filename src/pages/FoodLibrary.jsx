import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

import FoodGrid from "../components/food/FoodGrid";
import FoodFilters from "../components/food/FoodFilters";
import FoodForm from "../components/food/FoodForm";
import FoodDetails from "../components/food/FoodDetails";
import FoodAIAssistant from "../components/food/FoodAIAssistant";

export default function FoodLibrary() {
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [filters, setFilters] = useState({ category: "all", favorite: false, search: "" });

  const queryClient = useQueryClient();

  const { data: foods, isLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: () => base44.entities.Food.list("-created_date"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (newFood) => base44.entities.Food.create(newFood),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      setShowForm(false);
      setEditingFood(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Food.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      setShowForm(false);
      setEditingFood(null);
      setSelectedFood(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Food.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      setSelectedFood(null);
    },
  });

  const handleSave = (data) => {
    if (editingFood) {
      updateMutation.mutate({ id: editingFood.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setShowForm(true);
    setSelectedFood(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este alimento?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleFavorite = async (food) => {
    updateMutation.mutate({
      id: food.id,
      data: { ...food, is_favorite: !food.is_favorite }
    });
  };

  const filteredFoods = foods.filter(food => {
    const categoryMatch = filters.category === "all" || food.category === filters.category;
    const favoriteMatch = !filters.favorite || food.is_favorite;
    const searchMatch = !filters.search || 
      food.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      food.description?.toLowerCase().includes(filters.search.toLowerCase());
    return categoryMatch && favoriteMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Banco de Alimentos
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie alimentos e informações nutricionais
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAIAssistant(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Assistente IA
            </Button>
            <Button
              onClick={() => {
                setEditingFood(null);
                setShowForm(true);
              }}
              variant="outline"
              className="shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        <FoodFilters filters={filters} onFilterChange={setFilters} />

        <FoodGrid
          foods={filteredFoods}
          isLoading={isLoading}
          onSelectFood={setSelectedFood}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />

        {showForm && (
          <FoodForm
            food={editingFood}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingFood(null);
            }}
          />
        )}

        {selectedFood && (
          <FoodDetails
            food={selectedFood}
            onClose={() => setSelectedFood(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {showAIAssistant && (
          <FoodAIAssistant
            onClose={() => setShowAIAssistant(false)}
          />
        )}
      </div>
    </div>
  );
}