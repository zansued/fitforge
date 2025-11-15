import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function ExerciseFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.category} 
          onValueChange={(value) => onFilterChange({...filters, category: value})}
        >
          <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="peito">Peito</SelectItem>
            <SelectItem value="costas">Costas</SelectItem>
            <SelectItem value="pernas">Pernas</SelectItem>
            <SelectItem value="ombros">Ombros</SelectItem>
            <SelectItem value="bracos">Braços</SelectItem>
            <SelectItem value="abdomen">Abdômen</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
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
          <SelectItem value="iniciante">Iniciante</SelectItem>
          <SelectItem value="intermediario">Intermediário</SelectItem>
          <SelectItem value="avancado">Avançado</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.equipment} 
        onValueChange={(value) => onFilterChange({...filters, equipment: value})}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
          <SelectValue placeholder="Equipamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="barra">Barra</SelectItem>
          <SelectItem value="halteres">Halteres</SelectItem>
          <SelectItem value="maquina">Máquina</SelectItem>
          <SelectItem value="peso_corporal">Peso Corporal</SelectItem>
          <SelectItem value="cabo">Cabo</SelectItem>
          <SelectItem value="kettlebell">Kettlebell</SelectItem>
          <SelectItem value="nenhum">Nenhum</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}