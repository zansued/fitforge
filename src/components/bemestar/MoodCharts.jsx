import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { TrendingUp, Moon, Activity } from "lucide-react";

export default function MoodCharts({ entries }) {
  if (entries.length === 0) return null;

  const moodValues = {
    muito_triste: 1,
    triste: 3,
    ansioso: 4,
    estressado: 4,
    cansado: 5,
    neutro: 5,
    calmo: 7,
    feliz: 8,
    energizado: 9,
    muito_feliz: 10
  };

  const chartData = entries
    .slice(0, 14)
    .reverse()
    .map(entry => ({
      date: format(new Date(entry.date), 'dd/MM'),
      humor: moodValues[entry.mood] || 5,
      intensidade: entry.intensity,
      sono: entry.sleep_hours || 0
    }));

  const avgMood = entries.slice(0, 7).reduce((acc, e) => acc + (moodValues[e.mood] || 5), 0) / Math.min(7, entries.length);
  const avgSleep = entries.slice(0, 7).reduce((acc, e) => acc + (e.sleep_hours || 0), 0) / Math.min(7, entries.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Média de Humor (7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-purple-600">
            {avgMood.toFixed(1)}/10
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {avgMood >= 7 ? "Você está bem! 😊" : avgMood >= 5 ? "Mantendo-se estável" : "Cuide-se mais 💙"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="w-5 h-5 text-blue-600" />
            Média de Sono (7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600">
            {avgSleep.toFixed(1)}h
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {avgSleep >= 7 ? "Ótimo descanso! 😴" : "Tente dormir mais"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Registros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            {entries.length}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Continue registrando! 📝
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg lg:col-span-3">
        <CardHeader>
          <CardTitle>Evolução do Humor</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="humor" stroke="#9333ea" strokeWidth={2} name="Humor" />
              <Line type="monotone" dataKey="intensidade" stroke="#3b82f6" strokeWidth={2} name="Intensidade" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg lg:col-span-3">
        <CardHeader>
          <CardTitle>Horas de Sono</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sono" fill="#3b82f6" name="Horas de sono" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}