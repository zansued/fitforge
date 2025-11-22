import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Mail, Send, Loader2, Check } from "lucide-react";

export default function ShareRecipe({ recipe, onClose }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    setIsSending(true);
    
    try {
      const ingredientsList = recipe.ingredients
        ?.map(ing => `- ${ing.food_name || ing} (${ing.quantity || ''}g) ${ing.notes || ''}`)
        .join('\n') || 'Não especificado';

      const instructionsList = recipe.instructions
        ?.map((inst, idx) => `${idx + 1}. ${inst}`)
        .join('\n') || 'Não especificado';

      const emailBody = `Olá! Quero compartilhar uma receita com você:

📖 ${recipe.title}
${recipe.description ? `\n${recipe.description}\n` : ''}

⏱️ Tempo de Preparo: ${recipe.prep_time_minutes || 0} minutos
👥 Porções: ${recipe.servings || 1}
📊 Calorias por porção: ${recipe.calories_per_serving || 0} kcal

🥗 INGREDIENTES:
${ingredientsList}

👨‍🍳 MODO DE PREPARO:
${instructionsList}

💪 INFORMAÇÕES NUTRICIONAIS (por porção):
- Proteínas: ${recipe.protein_grams || 0}g
- Carboidratos: ${recipe.carbs_grams || 0}g
- Gorduras: ${recipe.fat_grams || 0}g

Bom apetite! 😋`;

      await base44.integrations.Core.SendEmail({
        to: email,
        subject: `Receita: ${recipe.title}`,
        body: emailBody
      });

      setSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      alert("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Confira esta receita: ${recipe.title}\n\n${recipe.description || ''}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            Compartilhar Receita
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-600">Enviado com sucesso!</h3>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email">Compartilhar por E-mail</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                />
                <Button
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="#25D366" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Compartilhar no WhatsApp
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}