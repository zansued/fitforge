import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import ProgressoForm from "../components/progresso/ProgressoForm";
import ProgressoList from "../components/progresso/ProgressoList";
import ProgressoCharts from "../components/progresso/ProgressoCharts";
import ProgressoCoach from "../components/progresso/ProgressoCoach";

export default function Progresso() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const queryClient = useQueryClient();

  const { data: progressEntries, isLoading } = useQuery({
    queryKey: ["progressEntries"],
    queryFn: () => base44.entities.ProgressoCorporal.list("-data_medicao"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (newEntry) => base44.entities.ProgressoCorporal.create(newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressEntries"] });
      setShowForm(false);
      setEditingEntry(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProgressoCorporal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressEntries"] });
      setShowForm(false);
      setEditingEntry(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProgressoCorporal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressEntries"] });
    },
  });

  const handleSave = (data) => {
    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meu Progresso
            </h1>
            <p className="text-gray-600 mt-2">
              Acompanhe sua evolução corporal e visualize seus resultados.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>

        {/* Placeholder for future AI Coach */}
        <ProgressoCoach progressEntries={progressEntries} />

        {/* Placeholder for future Charts */}
        <ProgressoCharts progressEntries={progressEntries} />

        <ProgressoList
          entries={progressEntries}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showForm && (
          <ProgressoForm
            entry={editingEntry}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
          />
        )}
      </div>
    </div>
  );
}