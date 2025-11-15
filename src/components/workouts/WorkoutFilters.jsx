import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function WorkoutFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.type} 
          onValueChange={(value) => onFilterChange({...filters, type: value})}
        >
          <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="forca">Força</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="hiit">HIIT</SelectItem>
            <SelectItem value="funcional">Funcional</SelectItem>
            <SelectItem value="alongamento">Alongamento</SelectItem>
            <SelectItem value="fullbody">Full Body</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs 
        value={filters.completed} 
        onValueChange={(value) => onFilterChange({...filters, completed: value})}
        className="bg-white/80 backdrop-blur-sm rounded-lg"
      >
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Completos</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}