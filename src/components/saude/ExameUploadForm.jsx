import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Upload, Loader2, FileText } from "lucide-react";

export default function ExameUploadForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    data_exame: new Date(),
    tipo_exame: "completo",
    notas: ""
  });
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  const tipoExameLabels = {
    hemograma: "Hemograma Completo",
    colesterol: "Perfil Lipídico (Colesterol)",
    glicemia: "Glicemia",
    hormonal: "Painel Hormonal",
    vitaminas: "Vitaminas e Minerais",
    completo: "Check-up Completo",
    outro: "Outro"
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Por favor, faça upload do arquivo do exame.");
      return;
    }

    setIsProcessing(true);
    
    try {
      setProcessingStep("Fazendo upload do arquivo...");
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      setProcessingStep("Extraindo dados do exame...");
      const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: file_url,
        json_schema: {
          type: "object",
          properties: {
            resultados: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  parametro: { type: "string" },
                  valor: { type: "string" },
                  unidade: { type: "string" },
                  referencia: { type: "string" }
                }
              }
            }
          }
        }
      });

      let dadosExtraidos = null;
      if (extractionResult.status === "success" && extractionResult.output) {
        dadosExtraidos = extractionResult.output;
      }

      setProcessingStep("Analisando com IA...");
      const analisePrompt = `Você é um assistente de saúde com conhecimento em análise de exames laboratoriais. 
Analise os seguintes resultados de exame e forneça:
1. Um resumo dos principais achados
2. Valores que estão fora da faixa de referência (se houver)
3. Recomendações gerais de estilo de vida e nutrição
4. Sugestão de acompanhamento médico se necessário

IMPORTANTE: Deixe claro que esta é apenas uma análise informativa e não substitui a consulta médica.

Tipo de exame: ${tipoExameLabels[formData.tipo_exame]}
Data do exame: ${format(new Date(formData.data_exame), 'dd/MM/yyyy')}

${dadosExtraidos ? `Dados extraídos do exame:\n${JSON.stringify(dadosExtraidos, null, 2)}` : 'Não foi possível extrair dados estruturados do arquivo. Faça uma análise geral baseada no tipo de exame.'}

${formData.notas ? `Observações do paciente: ${formData.notas}` : ''}

Forneça uma análise completa, didática e acessível.`;

      const analiseIA = await base44.integrations.Core.InvokeLLM({
        prompt: analisePrompt,
        file_urls: [file_url]
      });

      const exameCompleto = {
        ...formData,
        arquivo_url: file_url,
        dados_extraidos: dadosExtraidos,
        analise_ia: analiseIA
      };

      onSave(exameCompleto);
    } catch (error) {
      console.error("Erro ao processar exame:", error);
      alert("Houve um erro ao processar o exame. Por favor, tente novamente.");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Exame de Saúde</DialogTitle>
        </DialogHeader>

        {isProcessing ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{processingStep}</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Aguarde enquanto processamos e analisamos seu exame...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_exame">Data do Exame *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(formData.data_exame), 'dd/MM/yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.data_exame)}
                      onSelect={(date) => setFormData({ ...formData, data_exame: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_exame">Tipo de Exame *</Label>
                <Select value={formData.tipo_exame} onValueChange={(value) => setFormData({ ...formData, tipo_exame: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoExameLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="arquivo">Arquivo do Exame (PDF ou Imagem) *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Input
                  id="arquivo"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="arquivo" className="cursor-pointer">
                  <span className="text-purple-600 hover:text-purple-700 font-medium">
                    Clique para selecionar
                  </span>
                  <span className="text-gray-500"> ou arraste o arquivo aqui</span>
                </label>
                {file && (
                  <p className="text-sm text-gray-600 mt-3">
                    Arquivo selecionado: <strong>{file.name}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Observações (Opcional)</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Adicione contexto: sintomas, medicamentos em uso, etc."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Processar Exame
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}