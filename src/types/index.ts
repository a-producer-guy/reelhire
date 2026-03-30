export type TimecardWithRelations = {
  id: string;
  employeeId: string;
  productionId: string;
  weekEnding: Date | string;
  status: string;
  workLocation: string | null;
  studio: string | null;
  jobTitle: string | null;
  unionLocal: string | null;
  department: string | null;
  accountCode: string | null;
  ff1: string | null;
  ff2: string | null;
  series: string | null;
  locationNote: string | null;
  setNote: string | null;
  weeklyRate: number | null;
  hourlyRate: number | null;
  guaranteedHours: number | null;
  payType: string | null;
  totalStraight: number;
  totalOT15: number;
  totalOT2: number;
  totalOT25: number;
  totalOT3: number;
  totalForced: number;
  totalGold: number;
  totalAllowances: number;
  totalPenalties: number;
  totalPay: number;
  dailyComments: string | null;
  employeeComments: string | null;
  employerComments: string | null;
  payrollComments: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  employee: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle: string | null;
    unionLocal: string | null;
    department: string | null;
  };
  production: {
    id: string;
    name: string;
    code: string;
  };
  entries: TimecardEntryData[];
  allowances: TimecardAllowanceData[];
  reviews: TimecardReviewData[];
};

export type TimecardEntryData = {
  id: string;
  timecardId: string;
  date: Date | string;
  dayOfWeek: string;
  payType: string;
  location: string | null;
  timeIn: string | null;
  meal1Out: string | null;
  meal1In: string | null;
  meal2Out: string | null;
  meal2In: string | null;
  timeOut: string | null;
  mp1: number;
  mp2: number;
  mealPenalties: number;
  straightTime: number;
  ot15: number;
  ot2: number;
  ot25: number;
  ot3Plus: number;
  goldTime: number;
  forcedCall: number;
  totalHours: number;
};

export type TimecardAllowanceData = {
  id: string;
  timecardId: string;
  type: string;
  rate: number | null;
  daysWorked: number;
  amount: number;
  accountCode: string | null;
  ff1: string | null;
  ff2: string | null;
  isTaxable: boolean;
};

export type TimecardReviewData = {
  id: string;
  timecardId: string;
  reviewerId: string;
  action: string;
  comment: string | null;
  tier: number;
  createdAt: Date | string;
  reviewer: {
    id: string;
    name: string;
    role: string;
  };
};

export type DashboardTab =
  | "todo"
  | "open"
  | "approved"
  | "missing"
  | "starts"
  | "history"
  | "roster";

export const ALLOWANCE_TYPES = [
  "Kit/Box Rental NT",
  "Kit/Box Taxable",
  "Cell Allowance",
  "Per Diem NT",
  "PD Taxable",
  "Lodging NT",
  "Lodging Taxable",
  "Per Diem Advance",
  "Mileage",
  "Car Allowance",
] as const;

export const PAY_TYPES = [
  "WORKED",
  "NOT_WORKED",
  "HOLIDAY",
  "SICK",
  "VACATION",
  "UNPAID_DAY",
  "TRAVEL",
  "PREP",
  "WRAP",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  EMPLOYEE_COMPLETED: "Employee Completed",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  RETURNED: "Returned",
  SUBMITTED_TO_PAYROLL: "Submitted to Payroll",
  PROCESSED: "Processed",
  VOIDED: "Voided",
};

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  EMPLOYEE_COMPLETED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  RETURNED: "bg-red-100 text-red-800",
  SUBMITTED_TO_PAYROLL: "bg-purple-100 text-purple-800",
  PROCESSED: "bg-emerald-100 text-emerald-800",
  VOIDED: "bg-gray-200 text-gray-500",
};
