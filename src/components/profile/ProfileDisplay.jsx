import { Badge } from "@/components/ui/badge";

export default function ProfileDisplay({ profile }) {
  const goalLabels = {
    perder_peso: "Perder Peso",
    ganhar_massa: "Ganhar Massa Muscular",
    definir: "Definir / Tonificar",
    melhorar_condicionamento: "Melhorar Condicionamento",
    manter_forma: "Manter a Forma"
  };

  const levelLabels = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.age && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Idade</p>
            <p className="text-lg font-semibold">{profile.age} anos</p>
          </div>
        )}

        {profile.gender && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Gênero</p>
            <p className="text-lg font-semibold capitalize">{profile.gender}</p>
          </div>
        )}

        {profile.weight && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Peso</p>
            <p className="text-lg font-semibold">{profile.weight} kg</p>
          </div>
        )}

        {profile.height && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Altura</p>
            <p className="text-lg font-semibold">{profile.height} cm</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-1">Nível</p>
          <Badge className="bg-purple-100 text-purple-700">
            {levelLabels[profile.fitness_level]}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Objetivo</p>
          <Badge className="bg-blue-100 text-blue-700">
            {goalLabels[profile.goal]}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Frequência</p>
          <p className="text-lg font-semibold">{profile.days_per_week}x por semana</p>
        </div>
      </div>

      {profile.health_issues && (
        <div className="pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2">Observações de Saúde</p>
          <p className="text-gray-700">{profile.health_issues}</p>
        </div>
      )}
    </div>
  );
}