import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ExameUploadForm from "../components/saude/ExameUploadForm";
import ExamesList from "../components/saude/ExamesList";
import ExameDetails from "../components/saude/ExameDetails";

export default function Saude() {
  const [showForm, setShowForm] = useState(false);
  const [selectedExame, setSelectedExame] = useState(null);
  const queryClient = useQueryClient();

  const { data: exames, isLoading } = useQuery({
    queryKey: ["examesSaude"],
    queryFn: () => base44.entities.ExameSaude.list("-data_exame"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (newExame) => base44.entities.ExameSaude.create(newExame),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examesSaude"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ExameSaude.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examesSaude"] });
      setSelectedExame(null);
    },
  });

  const handleSave = (data) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este exame?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Análise de Saúde com IA
            </h1>
            <p className="text-gray-600 mt-2">
              Faça upload dos seus exames e receba insights personalizados.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exame
          </Button>
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Aviso Importante:</strong> As análises fornecidas pela IA são apenas para fins informativos e educacionais. 
            Não substituem consultas médicas profissionais. Sempre consulte seu médico para decisões sobre sua saúde.
          </AlertDescription>
        </Alert>

        <ExamesList
          exames={exames}
          isLoading={isLoading}
          onSelect={setSelectedExame}
          onDelete={handleDelete}
        />

        {showForm && (
          <ExameUploadForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        {selectedExame && (
          <ExameDetails
            exame={selectedExame}
            onClose={() => setSelectedExame(null)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}