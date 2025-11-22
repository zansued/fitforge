import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function IngredientSelector({ ingredients, onChange }) {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      const allFoods = await base44.entities.Food.list("name");
      setFoods(allFoods);
    } catch (error) {
      console.error("Erro ao carregar alimentos:", error);
    }
    setIsLoading(false);
  };

  const addIngredient = () => {
    onChange([
      ...ingredients,
      { food_id: "", food_name: "", quantity: 100, notes: "" }
    ]);
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const selectFood = (index, food) => {
    const updated = [...ingredients];
    updated[index] = {
      ...updated[index],
      food_id: food.id,
      food_name: food.name
    };
    onChange(updated);
  };

  const removeIngredient = (index) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-gray-600">Alimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {ingredient.food_name || "Selecionar alimento"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar alimento..." />
                    <CommandList>
                      <CommandEmpty>Nenhum alimento encontrado.</CommandEmpty>
                      <CommandGroup>
                        {foods.map((food) => (
                          <CommandItem
                            key={food.id}
                            onSelect={() => selectFood(index, food)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{food.name}</span>
                              <span className="text-xs text-gray-500">
                                {food.calories || 0} cal • {food.protein_grams || 0}g prot
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-32">
              <Label className="text-xs text-gray-600">Quantidade (g)</Label>
              <Input
                type="number"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeIngredient(index)}
              className="mt-5"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
          <div>
            <Label className="text-xs text-gray-600">Observações (opcional)</Label>
            <Input
              value={ingredient.notes || ""}
              onChange={(e) => updateIngredient(index, "notes", e.target.value)}
              placeholder="Ex: picado, cozido..."
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addIngredient} className="w-full">
        + Adicionar Ingrediente
      </Button>
    </div>
  );
}