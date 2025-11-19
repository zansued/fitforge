import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Send, Loader2 } from "lucide-react";

export default function AICoach({ entries, onClose }) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = question.trim();
    setQuestion("");
    setConversation(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const recentEntries = entries.slice(0, 7);
      const context = recentEntries.length > 0 
        ? `Histórico recente do usuário (últimos 7 dias):\n${recentEntries.map(e => 
            `- ${e.date}: Humor ${e.mood}, Intensidade ${e.intensity}/10, Sono: ${e.sleep_hours || 0}h`
          ).join('\n')}`
        : "Usuário ainda não tem registros.";

      const prompt = `Você é um psicólogo especializado em bem-estar mental e coach de vida. Seja empático, acolhedor e prático.

${context}

Pergunta do usuário: ${userMessage}

Forneça uma resposta construtiva que:
1. Valide os sentimentos
2. Ofereça insights baseados no histórico (se houver)
3. Sugira técnicas práticas ou exercícios
4. Seja motivador e realista

IMPORTANTE: Lembre que você é um assistente e não substitui terapia profissional. Se identificar sinais graves, sugira buscar ajuda profissional.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt
      });

      setConversation(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Erro ao consultar IA:", error);
      setConversation(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, houve um erro ao processar sua pergunta. Tente novamente." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Como posso melhorar meu humor?",
    "Dicas para lidar com ansiedade",
    "Como ter uma rotina mais equilibrada?",
    "Técnicas de mindfulness para iniciantes",
    "Como melhorar a qualidade do sono?"
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-6 h-6 text-purple-600" />
            Coach de Bem-Estar IA
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {conversation.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">
                Converse comigo sobre seu bem-estar mental e emocional
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">Perguntas sugeridas:</p>
                {quickQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() => setQuestion(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{msg.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua pergunta..."
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <Button
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}