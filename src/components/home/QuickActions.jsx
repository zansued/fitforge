import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, BookOpen, User } from "lucide-react";

export default function QuickActions({ profile }) {
  const actions = [
    {
      title: "Gerar Novo Treino",
      description: "Crie um treino personalizado com IA",
      icon: Sparkles,
      link: createPageUrl("Workouts"),
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Ver Meus Treinos",
      description: "Acesse seus treinos salvos",
      icon: Calendar,
      link: createPageUrl("Workouts"),
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Biblioteca",
      description: "Explore exercícios",
      icon: BookOpen,
      link: createPageUrl("ExerciseLibrary"),
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100"
    },
    {
      title: "Editar Perfil",
      description: "Atualize suas informações",
      icon: User,
      link: createPageUrl("Profile"),
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
              <CardContent className={`p-6 bg-gradient-to-br ${action.bgGradient} h-full`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}