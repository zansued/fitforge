import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, Heart } from "lucide-react";

export default function FoodFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar alimentos..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.category} 
          onValueChange={(value) => onFilterChange({ ...filters, category: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
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

      <Button
        variant={filters.favorite ? "default" : "outline"}
        onClick={() => onFilterChange({ ...filters, favorite: !filters.favorite })}
        className={filters.favorite ? "bg-red-500 hover:bg-red-600" : ""}
      >
        <Heart className={`w-4 h-4 mr-2 ${filters.favorite ? 'fill-current' : ''}`} />
        Favoritos
      </Button>
    </div>
  );
}