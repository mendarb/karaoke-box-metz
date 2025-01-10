import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BookingStepsChartProps {
  data: {
    name: string;
    total: number;
    completed: number;
    dropoff: number;
  }[];
}

export const BookingStepsChart = ({ data }: BookingStepsChartProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Suivi des étapes de réservation</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" name="Total" stroke="#8884d8" />
            <Line type="monotone" dataKey="completed" name="Complétées" stroke="#82ca9d" />
            <Line type="monotone" dataKey="dropoff" name="Abandons" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};