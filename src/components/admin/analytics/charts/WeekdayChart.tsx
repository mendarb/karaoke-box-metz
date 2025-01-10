import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeekdayChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const WeekdayChart = ({ data }: WeekdayChartProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Répartition par jour de la semaine</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};