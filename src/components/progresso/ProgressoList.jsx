import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, Weight, Ruler } from 'lucide-react';

export default function ProgressoList({ entries, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando registros...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum registro de progresso encontrado</p>
          <p className="text-sm text-gray-400 mt-2">Clique em "Novo Registro" para começar a acompanhar sua evolução.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-900">Histórico de Registros</h2>
        {entries.map((entry) => (
            <Card key={entry.id} className="shadow-lg border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-white/80 backdrop-blur-sm border-b">
                <CardTitle className="text-xl">
                    {format(new Date(entry.data_medicao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-4 rounded-lg bg-gray-50">
                    {entry.foto_url ? (
                        <img src={entry.foto_url} alt={`Progresso em ${entry.data_medicao}`} className="w-full h-auto max-h-64 object-contain rounded-lg shadow-md mb-4" />
                    ) : (
                       <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400">
                           Sem foto
                       </div>
                    )}
                    <div className="flex items-center gap-2 text-3xl font-bold text-purple-700">
                        <Weight className="w-7 h-7" />
                        <span>{entry.peso} kg</span>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Ruler className="w-4 h-4 text-blue-600"/>Medidas (cm)</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            {entry.medida_peito && <p><span className="font-semibold">Peito:</span> {entry.medida_peito}</p>}
                            {entry.medida_cintura && <p><span className="font-semibold">Cintura:</span> {entry.medida_cintura}</p>}
                            {entry.medida_quadril && <p><span className="font-semibold">Quadril:</span> {entry.medida_quadril}</p>}
                            {entry.medida_braco_d && <p><span className="font-semibold">Braço D:</span> {entry.medida_braco_d}</p>}
                            {entry.medida_braco_e && <p><span className="font-semibold">Braço E:</span> {entry.medida_braco_e}</p>}
                            {entry.medida_coxa_d && <p><span className="font-semibold">Coxa D:</span> {entry.medida_coxa_d}</p>}
                            {entry.medida_coxa_e && <p><span className="font-semibold">Coxa E:</span> {entry.medida_coxa_e}</p>}
                        </div>
                    </div>
                    {entry.notas && (
                         <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Anotações</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">{entry.notas}</p>
                        </div>
                    )}
                </div>
            </CardContent>
            </Card>
        ))}
    </div>
  );
}