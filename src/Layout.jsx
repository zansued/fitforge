import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Dumbbell, User, BookOpen, TrendingUp, Menu, ChefHat, Activity, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Home"),
    icon: Home,
    colors: {
      bg: "bg-blue-50",
      bgHover: "hover:bg-blue-100",
      bgActive: "bg-blue-500",
      text: "text-blue-700",
      textActive: "text-white",
      border: "border-blue-200"
    }
  },
  {
    title: "Meu Perfil",
    url: createPageUrl("Profile"),
    icon: User,
    colors: {
      bg: "bg-purple-50",
      bgHover: "hover:bg-purple-100",
      bgActive: "bg-purple-500",
      text: "text-purple-700",
      textActive: "text-white",
      border: "border-purple-200"
    }
  },
  {
    title: "Meus Treinos",
    url: createPageUrl("Workouts"),
    icon: Dumbbell,
    colors: {
      bg: "bg-orange-50",
      bgHover: "hover:bg-orange-100",
      bgActive: "bg-orange-500",
      text: "text-orange-700",
      textActive: "text-white",
      border: "border-orange-200"
    }
  },
  {
    title: "Receitas",
    url: createPageUrl("Recipes"),
    icon: ChefHat,
    colors: {
      bg: "bg-green-50",
      bgHover: "hover:bg-green-100",
      bgActive: "bg-green-500",
      text: "text-green-700",
      textActive: "text-white",
      border: "border-green-200"
    }
  },
  {
    title: "Alimentos",
    url: createPageUrl("FoodLibrary"),
    icon: BookOpen,
    colors: {
      bg: "bg-emerald-50",
      bgHover: "hover:bg-emerald-100",
      bgActive: "bg-emerald-500",
      text: "text-emerald-700",
      textActive: "text-white",
      border: "border-emerald-200"
    }
  },
  {
    title: "Progresso",
    url: createPageUrl("Progresso"),
    icon: TrendingUp,
    colors: {
      bg: "bg-cyan-50",
      bgHover: "hover:bg-cyan-100",
      bgActive: "bg-cyan-500",
      text: "text-cyan-700",
      textActive: "text-white",
      border: "border-cyan-200"
    }
  },
  {
    title: "Saúde",
    url: createPageUrl("Saude"),
    icon: Activity,
    colors: {
      bg: "bg-pink-50",
      bgHover: "hover:bg-pink-100",
      bgActive: "bg-pink-500",
      text: "text-pink-700",
      textActive: "text-white",
      border: "border-pink-200"
    }
  },
  {
    title: "Bem-Estar",
    url: createPageUrl("BemEstar"),
    icon: Brain,
    colors: {
      bg: "bg-violet-50",
      bgHover: "hover:bg-violet-100",
      bgActive: "bg-violet-500",
      text: "text-violet-700",
      textActive: "text-white",
      border: "border-violet-200"
    }
  },
  {
    title: "Exercícios",
    url: createPageUrl("ExerciseLibrary"),
    icon: Dumbbell,
    colors: {
      bg: "bg-indigo-50",
      bgHover: "hover:bg-indigo-100",
      bgActive: "bg-indigo-500",
      text: "text-indigo-700",
      textActive: "text-white",
      border: "border-indigo-200"
    }
  },
  ];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Sidebar className="border-r border-gray-200/50 backdrop-blur-sm">
          <SidebarHeader className="border-b border-gray-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  FitPersonal
                </h2>
                <p className="text-xs text-gray-500">Seu treino ideal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            transition-all duration-200 rounded-xl border-2
                            ${isActive 
                              ? `${item.colors.bgActive} ${item.colors.textActive} shadow-lg border-transparent` 
                              : `${item.colors.bg} ${item.colors.text} ${item.colors.bgHover} ${item.colors.border}`
                            }
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-6 h-6" />
                            <span className="font-semibold text-base">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-200/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-sm text-gray-900">Progresso</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">Continue evoluindo!</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Meta Semanal</span>
                  <span className="font-semibold text-purple-600">0/3</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FitPersonal
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}