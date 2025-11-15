import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save, X, Loader2 } from "lucide-react";

export default function ProgressoForm({ entry, onSave, onCancel }) {
  const [formData, setFormData] = useState(entry || {
    data_medicao: new Date(),
    peso: "",
    medida_peito: "",
    medida_cintura: "",
    medida_quadril: "",
    medida_braco_d: "",
    medida_braco_e: "",
    medida_coxa_d: "",
    medida_coxa_e: "",
    foto_url: "",
    notas: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalData = { ...formData };

    try {
      if (photoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
        finalData.foto_url = file_url;
      }
      
      // Convert all number fields from string to number
      Object.keys(finalData).forEach(key => {
        if (['peso', 'medida_peito', 'medida_cintura', 'medida_quadril', 'medida_braco_d', 'medida_braco_e', 'medida_coxa_d', 'medida_coxa_e'].includes(key)) {
            finalData[key] = parseFloat(finalData[key]) || null;
        }
      });

      onSave(finalData);
    } catch (error) {
      console.error("Erro ao salvar progresso", error);
      alert("Houve um erro ao salvar o registro. Verifique os dados e tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? "Editar Registro" : "Novo Registro de Progresso"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_medicao">Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.data_medicao ? format(new Date(formData.data_medicao), 'dd/MM/yyyy') : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.data_medicao)}
                    onSelect={(date) => setFormData({ ...formData, data_medicao: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg) *</Label>
              <Input id="peso" type="number" step="0.1" value={formData.peso} onChange={(e) => setFormData({...formData, peso: e.target.value})} required />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
             <h3 className="text-md font-medium text-gray-800">Medidas Corporais (cm) - Opcional</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2"><Label htmlFor="medida_peito">Peito</Label><Input id="medida_peito" type="number" step="0.1" value={formData.medida_peito} onChange={(e) => setFormData({...formData, medida_peito: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="medida_cintura">Cintura</Label><Input id="medida_cintura" type="number" step="0.1" value={formData.medida_cintura} onChange={(e) => setFormData({...formData, medida_cintura: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="medida_quadril">Quadril</Label><Input id="medida_quadril" type="number" step="0.1" value={formData.medida_quadril} onChange={(e) => setFormData({...formData, medida_quadril: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="medida_braco_d">Braço D.</Label><Input id="medida_braco_d" type="number" step="0.1" value={formData.medida_braco_d} onChange={(e) => setFormData({...formData, medida_braco_d: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="medida_braco_e">Braço E.</Label><Input id="medida_braco_e" type="number" step="0.1" value={formData.medida_braco_e} onChange={(e) => setFormData({...formData, medida_braco_e: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="medida_coxa_d">Coxa D.</Label><Input id="medida_coxa_d" type="number" step="0.1" value={formData.medida_coxa_d} onChange={(e) => setFormData({...formData, medida_coxa_d: e.target.value})} /></div>
                <div className="space-y-2"><Label htmlFor="medida_coxa_e">Coxa E.</Label><Input id="medida_coxa_e" type="number" step="0.1" value={formData.medida_coxa_e} onChange={(e) => setFormData({...formData, medida_coxa_e: e.target.value})} /></div>
             </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="foto">Foto de Progresso (Opcional)</Label>
            <Input id="foto" type="file" accept="image/*" onChange={handleFileChange} />
            {photoFile && <p className="text-sm text-gray-500">Arquivo selecionado: {photoFile.name}</p>}
            {formData.foto_url && !photoFile && <p className="text-sm text-gray-500">Foto existente. Envie um novo arquivo para substituir.</p>}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="notas">Anotações</Label>
            <Textarea id="notas" value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} placeholder="Como você se sentiu hoje? Alguma observação?" />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isUploading ? "Salvando..." : "Salvar Registro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}