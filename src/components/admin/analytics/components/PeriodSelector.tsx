import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { PeriodSelection } from "../types/analytics";

interface PeriodSelectorProps {
  period: PeriodSelection;
  date?: DateRange;
  onPeriodChange: (value: string) => void;
  onDateChange: (newDate: DateRange | undefined) => void;
}

export const PeriodSelector = ({ period, date, onPeriodChange, onDateChange }: PeriodSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <Select defaultValue="7d" onValueChange={onPeriodChange}>
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
                onSelect={onDateChange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};