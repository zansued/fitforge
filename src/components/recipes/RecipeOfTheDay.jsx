
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Clock, Users, Flame } from "lucide-react";

export default function RecipeOfTheDay({ profile }) {
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('aleatorio'); // New state for selected category
  
  const categoryLabels = {
    cafe_da_manha: "Café da Manhã",
    almoco: "Almoço",
    jantar: "Jantar",
    lanche: "Lanche",
    pre_treino: "Pré-Treino",
    pos_treino: "Pós-Treino",
    sobremesa: "Sobremesa"
  };

  const generateRecipe = async () => {
    setIsGenerating(true);
    setRecipe(null);
    try {
      let prompt;
      if (selectedCategory && selectedCategory !== 'aleatorio') {
        const categoryLabel = categoryLabels[selectedCategory] || selectedCategory;
        prompt = `Gere uma receita saudável e deliciosa para um **${categoryLabel}**, focada em uma pessoa com perfil fitness.

${profile ? `Considere estas informações do perfil do usuário:
- Objetivo principal: ${profile.goal.replace(/_/g, ' ')}
- Frequência de treino: ${profile.days_per_week} vezes por semana` 
: 'O usuário é uma pessoa ativa que pratica exercícios regularmente.'}

A receita deve ser:
- Completa e nutritiva, adequada para a refeição (${categoryLabel}).
- Prática e com ingredientes acessíveis.
- **Importante: A receita deve ser diferente de receitas comuns como omelete, frango grelhado com batata doce ou salada simples. Pense em algo novo e criativo.**

Por favor, forneça todos os detalhes, incluindo informações nutricionais por porção.`;
      } else {
        const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const dayOfWeek = days[new Date().getDay()];
        const focusKeywords = [
          'surpreendente e criativa', 
          'rápida e prática para um dia corrido', 
          'clássica com um toque gourmet', 
          'com inspiração internacional', 
          'focada em superalimentos', 
          'altamente proteica para pós-treino',
          'leve e refrescante'
        ];
        const randomFocus = focusKeywords[Math.floor(Math.random() * focusKeywords.length)];

        prompt = `Gere uma receita saudável e deliciosa para hoje (${dayOfWeek}), focada em uma pessoa com perfil fitness. O foco para a receita de hoje é que ela seja **${randomFocus}**.

${profile ? `Considere estas informações do perfil do usuário:
- Objetivo principal: ${profile.goal.replace(/_/g, ' ')}
- Frequência de treino: ${profile.days_per_week} vezes por semana` 
: 'O usuário é uma pessoa ativa que pratica exercícios regularmente.'}

A receita deve ser:
- Completa e nutritiva.
- Prática e com ingredientes acessíveis.
- Saborosa e criativa.
- **Importante: A receita deve ser diferente de receitas comuns como omelete, frango grelhado com batata doce ou salada simples. Pense em algo novo.**

Por favor, forneça todos os detalhes, incluindo informações nutricionais por porção.`;
      }

      const simplifiedSchema = {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          category: {
            type: "string",
            enum: ["cafe_da_manha", "almoco", "jantar", "lanche", "pre_treino", "pos_treino", "sobremesa"],
          },
          prep_time_minutes: { type: "number" },
          servings: { type: "number" },
          calories_per_serving: { type: "number" },
          protein_grams: { type: "number" },
          ingredients: { type: "array", items: { type: "string" } },
          instructions: { type: "array", items: { type: "string" } },
        },
        required: ["title", "category", "ingredients", "instructions"],
      };
      
      setGenerationStep("Criando a receita...");
      const recipeResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: simplifiedSchema,
      });

      if (recipeResponse && recipeResponse.title) {
        setGenerationStep("Criando imagem da receita...");
        const imagePrompt = `Fotografia de comida profissional e deliciosa de "${recipeResponse.title}", em um prato, com iluminação de estúdio, super detalhada.`;
        const imageResponse = await base44.integrations.Core.GenerateImage({ prompt: imagePrompt });

        const fullRecipe = {
          ...recipeResponse,
          difficulty: recipeResponse.difficulty || "facil",
          tags: recipeResponse.tags || [],
          is_favorite: false,
          image_url: imageResponse.url,
          // Garante que a categoria gerada seja a selecionada, se aplicável
          category: selectedCategory !== 'aleatorio' ? selectedCategory : recipeResponse.category,
        };
        setRecipe(fullRecipe);
      } else {
        throw new Error("A IA não retornou uma receita válida.");
      }

    } catch (error) {
      console.error("Erro ao gerar receita:", error);
      alert("Houve um problema ao gerar a receita. Por favor, tente novamente.");
    }
    setIsGenerating(false);
    setGenerationStep("");
  };

  const saveRecipe = async () => {
    if (!recipe) return;
    try {
      await base44.entities.Recipe.create(recipe);
      alert("Receita salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      alert("Erro ao salvar receita.");
    }
  };

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 overflow-hidden">
      <CardHeader className="border-b border-orange-200/50 bg-gradient-to-r from-orange-100/50 to-yellow-100/50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-orange-600" />
          Receita do Dia com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!recipe && !isGenerating ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Descubra sua receita personalizada</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Selecione uma categoria ou peça uma surpresa para a IA gerar uma receita saudável.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[220px] bg-white shadow-sm">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aleatorio">✨ Surpreenda-me!</SelectItem>
                  <SelectItem value="cafe_da_manha">Café da Manhã</SelectItem>
                  <SelectItem value="almoco">Almoço</SelectItem>
                  <SelectItem value="jantar">Jantar</SelectItem>
                  <SelectItem value="lanche">Lanche</SelectItem>
                  <SelectItem value="pre_treino">Pré-Treino</SelectItem>
                  <SelectItem value="pos_treino">Pós-Treino</SelectItem>
                  <SelectItem value="sobremesa">Sobremesa</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={generateRecipe}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 shadow-lg w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar Receita
              </Button>
            </div>
          </div>
        ) : isGenerating ? (
           <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{generationStep || "Gerando..."}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nossa IA está cozinhando algo especial para você!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    {categoryLabels[recipe.category] || recipe.category}
                  </Badge>
                  {recipe.difficulty && (
                    <Badge variant="outline" className="capitalize">
                      {recipe.difficulty}
                    </Badge>
                  )}
                  {recipe.tags?.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                  onClick={saveRecipe}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Salvar Receita
                </Button>
                <Button
                  onClick={generateRecipe}
                  variant="outline"
                  disabled={isGenerating}
                >
                   {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Outra Receita'}
                </Button>
              </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/70 rounded-lg p-4 text-center">
                <Clock className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Preparo</p>
                <p className="font-semibold">{recipe.prep_time_minutes || 'N/A'} min</p>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center">
                <Users className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Porções</p>
                <p className="font-semibold">{recipe.servings || 'N/A'}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center">
                <Flame className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Calorias</p>
                <p className="font-semibold">{recipe.calories_per_serving || 'N/A'}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center">
                <span className="text-orange-600 font-bold text-xl mb-2 block">P</span>
                <p className="text-xs text-gray-600">Proteínas</p>
                <p className="font-semibold">{recipe.protein_grams || 'N/A'}g</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-orange-900">Ingredientes</h4>
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/70 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-orange-900">Modo de Preparo</h4>
                <ol className="space-y-3">
                  {recipe.instructions?.map((instruction, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
