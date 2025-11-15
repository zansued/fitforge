import { useState, useEffect } from "react";
import { UserProfile } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Edit } from "lucide-react";

import ProfileForm from "../components/profile/ProfileForm";
import ProfileDisplay from "../components/profile/ProfileDisplay";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async (data) => {
    try {
      if (profile) {
        await UserProfile.update(profile.id, data);
      } else {
        await UserProfile.create(data);
      }
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meu Perfil
            </h1>
            <p className="text-gray-600 mt-2">
              Personalize seu perfil para treinos mais eficientes
            </p>
          </div>
          {profile && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>

        <Card className="shadow-xl border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-purple-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Carregando perfil...</p>
              </div>
            ) : isEditing ? (
              <ProfileForm
                initialData={profile}
                onSave={handleSave}
                onCancel={() => profile && setIsEditing(false)}
              />
            ) : profile ? (
              <ProfileDisplay profile={profile} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum perfil encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}