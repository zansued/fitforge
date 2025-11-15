import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Clock, Target, TrendingUp } from "lucide-react";

export default function StatsGrid({ completedWorkouts, totalMinutes, weeklyGoal, isLoading }) {
  const stats = [
    {
      title: "Treinos Completos",
      value: completedWorkouts,
      icon: Dumbbell,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Minutos de Treino",
      value: totalMinutes,
      icon: Clock,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Meta Semanal",
      value: `${Math.min(completedWorkouts, weeklyGoal)}/${weeklyGoal}`,
      icon: Target,
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100"
    },
    {
      title: "Sequência",
      value: "🔥 0 dias",
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          <CardContent className={`p-6 bg-gradient-to-br ${stat.bgGradient} relative`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300`}></div>
            <div className="relative">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}