import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Calendar, Download, Trash2, Brain, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ExameDetails({ exame, onClose, onDelete }) {
  const tipoExameLabels = {
    hemograma: "Hemograma Completo",
    colesterol: "Perfil Lipídico (Colesterol)",
    glicemia: "Glicemia",
    hormonal: "Painel Hormonal",
    vitaminas: "Vitaminas e Minerais",
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2">Análise do Exame</DialogTitle>
              <div className="flex items-center gap-3">
                <Badge className={tipoColors[exame.tipo_exame] || tipoColors.outro}>
                  {tipoExameLabels[exame.tipo_exame] || "Outro"}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(exame.data_exame), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {exame.arquivo_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(exame.arquivo_url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(exame.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {exame.dados_extraidos && exame.dados_extraidos.resultados && (
            <Card className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Resultados Extraídos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Parâmetro</th>
                        <th className="text-left p-2 font-semibold">Valor</th>
                        <th className="text-left p-2 font-semibold">Referência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exame.dados_extraidos.resultados.map((resultado, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{resultado.parametro}</td>
                          <td className="p-2 font-medium">
                            {resultado.valor} {resultado.unidade}
                          </td>
                          <td className="p-2 text-gray-600">{resultado.referencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {exame.analise_ia && (
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Análise Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{exame.analise_ia}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {exame.notas && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suas Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{exame.notas}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}