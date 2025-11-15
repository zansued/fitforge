import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";

export default function ProfileSetupPrompt() {
  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 text-white">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Complete Seu Perfil</h2>
        <p className="text-white/90 mb-6 max-w-md mx-auto">
          Para criar treinos personalizados perfeitos para você, precisamos conhecer um pouco mais sobre seus objetivos e condicionamento físico.
        </p>
        <Link to={createPageUrl("Profile")}>
          <Button className="bg-white text-purple-600 hover:bg-white/90 shadow-lg">
            Configurar Perfil
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}