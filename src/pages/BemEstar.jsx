import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

import MoodEntryForm from "../components/bemestar/MoodEntryForm";
import MoodTimeline from "../components/bemestar/MoodTimeline";
import MoodCharts from "../components/bemestar/MoodCharts";
import AICoach from "../components/bemestar/AICoach";

export default function BemEstar() {
  const [showForm, setShowForm] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['moodEntries'],
    queryFn: () => base44.entities.MoodEntry.list("-date"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (newEntry) => base44.entities.MoodEntry.create(newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MoodEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
    },
  });

  const handleSave = (data) => {
    createMutation.mutate(data);
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
              Bem-Estar Mental
            </h1>
            <p className="text-gray-600 mt-2">
              Acompanhe suas emoções e receba insights personalizados
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAICoach(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Coach IA
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Registro
            </Button>
          </div>
        </div>

        <MoodCharts entries={entries} />

        <MoodTimeline 
          entries={entries} 
          isLoading={isLoading}
          onDelete={handleDelete}
        />

        {showForm && (
          <MoodEntryForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        {showAICoach && (
          <AICoach
            entries={entries}
            onClose={() => setShowAICoach(false)}
          />
        )}
      </div>
    </div>
  );
}