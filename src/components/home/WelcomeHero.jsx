import { Sparkles } from "lucide-react";

export default function WelcomeHero({ user, profile }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getMotivation = () => {
    const messages = [
      "Vamos treinar hoje?",
      "Seu corpo agradece cada treino!",
      "A disciplina bate o talento!",
      "Cada repetição conta!",
      "Força e determinação!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-sm font-medium opacity-90">{getGreeting()}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          {user?.full_name?.split(' ')[0] || 'Atleta'}
        </h1>
        
        <p className="text-xl sm:text-2xl font-medium opacity-90 mb-6">
          {getMotivation()}
        </p>

        {profile && (
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
              <p className="text-sm opacity-80">Objetivo</p>
              <p className="font-semibold capitalize">
                {profile.goal?.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
              <p className="text-sm opacity-80">Nível</p>
              <p className="font-semibold capitalize">{profile.fitness_level}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
              <p className="text-sm opacity-80">Meta Semanal</p>
              <p className="font-semibold">{profile.days_per_week}x por semana</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}