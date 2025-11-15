import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Eye, Trash2, Calendar } from "lucide-react";

export default function ExamesList({ exames, isLoading, onSelect, onDelete }) {
  const tipoExameLabels = {
    hemograma: "Hemograma",
    colesterol: "Colesterol",
    glicemia: "Glicemia",
    hormonal: "Hormonal",
    vitaminas: "Vitaminas",
    completo: "Check-up Completo",
    outro: "Outro"
  };

  const tipoColors = {
    hemograma: "bg-red-100 text-red-700",
    colesterol: "bg-yellow-100 text-yellow-700",
    glicemia: "bg-blue-100 text-blue-700",
    hormonal: "bg-purple-100 text-purple-700",
    vitaminas: "bg-green-100 text-green-700",
    completo: "bg-indigo-100 text-indigo-700",
    outro: "bg-gray-100 text-gray-700"
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando exames...</p>
      </div>
    );
  }

  if (exames.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum exame registrado</p>
          <p className="text-sm text-gray-400 mt-2">
            Clique em "Adicionar Exame" para começar a acompanhar sua saúde.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Seus Exames</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exames.map((exame) => (
          <Card key={exame.id} className="shadow-lg border-none hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onSelect(exame)}>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={tipoColors[exame.tipo_exame] || tipoColors.outro}>
                    {tipoExameLabels[exame.tipo_exame] || "Outro"}
                  </Badge>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(exame.data_exame), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(exame);
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Análise
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(exame.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}