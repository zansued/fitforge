import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipeFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.category} 
          onValueChange={(value) => onFilterChange({...filters, category: value})}
        >
          <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
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

      <Select 
        value={filters.difficulty} 
        onValueChange={(value) => onFilterChange({...filters, difficulty: value})}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
          <SelectValue placeholder="Dificuldade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="facil">Fácil</SelectItem>
          <SelectItem value="medio">Médio</SelectItem>
          <SelectItem value="dificil">Difícil</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={filters.favorite ? "default" : "outline"}
        onClick={() => onFilterChange({...filters, favorite: !filters.favorite})}
        className={filters.favorite ? "bg-red-500 hover:bg-red-600" : ""}
      >
        <Heart className={`w-4 h-4 mr-2 ${filters.favorite ? 'fill-white' : ''}`} />
        Favoritas
      </Button>
    </div>
  );
}