import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Dumbbell, User, BookOpen, TrendingUp, Menu, ChefHat, Activity } from "lucide-react";
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
  },
  {
    title: "Meu Perfil",
    url: createPageUrl("Profile"),
    icon: User,
  },
  {
    title: "Meus Treinos",
    url: createPageUrl("Workouts"),
    icon: Dumbbell,
  },
  {
    title: "Receitas",
    url: createPageUrl("Recipes"),
    icon: ChefHat,
  },
  {
    title: "Progresso",
    url: createPageUrl("Progresso"),
    icon: TrendingUp,
  },
  {
    title: "Saúde",
    url: createPageUrl("Saude"),
    icon: Activity,
  },
  {
    title: "Biblioteca",
    url: createPageUrl("ExerciseLibrary"),
    icon: BookOpen,
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
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`
                          hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50
                          transition-all duration-200 rounded-xl
                          ${location.pathname === item.url 
                            ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm' 
                            : 'text-gray-700'}
                        `}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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