import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralStats } from "./sections/GeneralStats";
import { BookingAnalytics } from "./sections/BookingAnalytics";
import { PromoAnalytics } from "./sections/PromoAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export type PeriodSelection = {
  type: "24h" | "7d" | "30d" | "90d" | "1y" | "custom";
  dateRange?: DateRange;
};

export const AnalyticsContent = () => {
  const [period, setPeriod] = useState<PeriodSelection>({ type: "7d" });
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handlePeriodChange = (value: string) => {
    if (value === "custom") {
      setPeriod({ type: "custom", dateRange: date });
    } else {
      setPeriod({ type: value as PeriodSelection["type"] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select defaultValue="7d" onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Dernières 24h</SelectItem>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">3 derniers mois</SelectItem>
            <SelectItem value="1y">Cette année</SelectItem>
            <SelectItem value="custom">Période personnalisée</SelectItem>
          </SelectContent>
        </Select>

        {period.type === "custom" && (
          <div className={cn("grid gap-2", period.type === "custom" ? "visible" : "hidden")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "d LLL y", { locale: fr })} -{" "}
                        {format(date.to, "d LLL y", { locale: fr })}
                      </>
                    ) : (
                      format(date.from, "d LLL y", { locale: fr })
                    )
                  ) : (
                    <span>Sélectionner une période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setPeriod({ type: "custom", dateRange: newDate });
                  }}
                  numberOfMonths={2}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <GeneralStats period={period} />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Tendances des réservations</h3>
              <BookingAnalytics period={period} />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Performance des promotions</h3>
              <PromoAnalytics period={period} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <BookingAnalytics period={period} />
        </TabsContent>

        <TabsContent value="promos">
          <PromoAnalytics period={period} />
        </TabsContent>
      </Tabs>
    </div>
  );
};