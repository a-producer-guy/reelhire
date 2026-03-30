import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function getWeekDates(weekEnding: Date): Date[] {
  const dates: Date[] = [];
  const end = new Date(weekEnding);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    dates.push(d);
  }
  return dates;
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
  });
}

export function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function calculateHours(timeIn: string, timeOut: string): number {
  if (!timeIn || !timeOut) return 0;
  const inMin = parseTimeToMinutes(timeIn);
  let outMin = parseTimeToMinutes(timeOut);
  if (outMin <= inMin) outMin += 24 * 60; // next day
  return (outMin - inMin) / 60;
}

export function calculateMealDeduction(
  meal1Out: string,
  meal1In: string,
  meal2Out: string,
  meal2In: string
): number {
  let deduction = 0;
  if (meal1Out && meal1In) {
    deduction += calculateHours(meal1Out, meal1In);
  }
  if (meal2Out && meal2In) {
    deduction += calculateHours(meal2Out, meal2In);
  }
  return deduction;
}

// Calculate OT breakdown based on entertainment industry rules
// ST: first 8 hours, 1.5x: 8-12 hours, 2x: 12+ hours
export function calculateOTBreakdown(totalWorkedHours: number) {
  const st = Math.min(totalWorkedHours, 8);
  const ot15 = Math.min(Math.max(totalWorkedHours - 8, 0), 4);
  const ot2 = Math.max(totalWorkedHours - 12, 0);

  return {
    straightTime: Math.round(st * 100) / 100,
    ot15: Math.round(ot15 * 100) / 100,
    ot2: Math.round(ot2 * 100) / 100,
    ot25: 0,
    ot3Plus: 0,
    goldTime: 0,
    forcedCall: 0,
    totalHours: Math.round(totalWorkedHours * 100) / 100,
  };
}

export function calculateEntryHours(entry: {
  timeIn?: string | null;
  timeOut?: string | null;
  meal1Out?: string | null;
  meal1In?: string | null;
  meal2Out?: string | null;
  meal2In?: string | null;
  payType: string;
}) {
  if (entry.payType === "NOT_WORKED" || entry.payType === "UNPAID_DAY") {
    return {
      straightTime: 0,
      ot15: 0,
      ot2: 0,
      ot25: 0,
      ot3Plus: 0,
      goldTime: 0,
      forcedCall: 0,
      totalHours: 0,
    };
  }

  const grossHours = calculateHours(entry.timeIn || "", entry.timeOut || "");
  const mealDeduction = calculateMealDeduction(
    entry.meal1Out || "",
    entry.meal1In || "",
    entry.meal2Out || "",
    entry.meal2In || ""
  );
  const netHours = Math.max(grossHours - mealDeduction, 0);

  return calculateOTBreakdown(netHours);
}

export function calculatePaySummary(
  entries: Array<{
    straightTime: number;
    ot15: number;
    ot2: number;
    ot25: number;
    ot3Plus: number;
    goldTime: number;
    forcedCall: number;
  }>,
  hourlyRate: number,
  allowances: number,
  penalties: number
) {
  const totalST = entries.reduce((sum, e) => sum + e.straightTime, 0);
  const totalOT15 = entries.reduce((sum, e) => sum + e.ot15, 0);
  const totalOT2 = entries.reduce((sum, e) => sum + e.ot2, 0);
  const totalForced = entries.reduce((sum, e) => sum + e.forcedCall, 0);

  const stPay = totalST * hourlyRate;
  const ot15Pay = totalOT15 * hourlyRate * 1.5;
  const ot2Pay = totalOT2 * hourlyRate * 2;
  const forcedPay = totalForced * hourlyRate * 2;

  return {
    stPay: Math.round(stPay * 100) / 100,
    ot15Pay: Math.round(ot15Pay * 100) / 100,
    ot2Pay: Math.round(ot2Pay * 100) / 100,
    forcedPay: Math.round(forcedPay * 100) / 100,
    allowances,
    penalties,
    totalPay:
      Math.round(
        (stPay + ot15Pay + ot2Pay + forcedPay + allowances - penalties) * 100
      ) / 100,
  };
}
