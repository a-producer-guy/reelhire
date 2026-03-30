// ─── Scene Types ─────────────────────────────────────

export type SceneData = {
  id: string;
  productionId: string;
  code: string;
  description: string | null;
  estimatedBudget: number | null;
  isActive: boolean;
};

export type TimecardEntrySceneData = {
  id: string;
  timecardEntryId: string;
  sceneId: string;
  hours: number;
  notes: string | null;
  scene?: SceneData;
};

// ─── Timecard Types ──────────────────────────────────

export type TimecardWithRelations = {
  id: string;
  contractorId: string;
  productionId: string;
  weekEnding: Date | string;
  status: string;
  workLocation: string | null;
  jobTitle: string | null;
  department: string | null;
  hourlyRate: number | null;
  dayRate: number | null;
  paymentTerms: string;
  totalHours: number;
  totalStraight: number;
  totalOT15: number;
  totalOT2: number;
  totalAllowances: number;
  totalPay: number;
  paymentDueDate: Date | string | null;
  paidDate: Date | string | null;
  contractorNotes: string | null;
  adminNotes: string | null;
  payrollNotes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  contractor: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle: string | null;
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
  timeIn: string | null;
  meal1Out: string | null;
  meal1In: string | null;
  meal2Out: string | null;
  meal2In: string | null;
  timeOut: string | null;
  straightTime: number;
  ot15: number;
  ot2: number;
  totalHours: number;
  scenes: TimecardEntrySceneData[];
};

export type TimecardAllowanceData = {
  id: string;
  timecardId: string;
  type: string;
  rate: number | null;
  quantity: number;
  amount: number;
  isTaxable: boolean;
};

export type TimecardReviewData = {
  id: string;
  timecardId: string;
  reviewerId: string;
  action: string;
  comment: string | null;
  createdAt: Date | string;
  reviewer: {
    id: string;
    name: string;
    role: string;
  };
};

// ─── Dashboard ───────────────────────────────────────

export type DashboardTab =
  | "pending"
  | "submitted"
  | "approved"
  | "payroll"
  | "paid"
  | "scenes";

// ─── Constants ───────────────────────────────────────

export const ALLOWANCE_TYPES = [
  "Kit Rental",
  "Equipment Rental",
  "Mileage",
  "Per Diem",
  "Hard Drive",
  "Software License",
  "Parking",
  "Other",
] as const;

export const PAY_TYPES = [
  "WORKED",
  "NOT_WORKED",
  "HOLIDAY",
  "SICK",
  "UNPAID_DAY",
  "TRAVEL",
  "PREP",
  "WRAP",
] as const;

export const PAYMENT_TERMS_LABELS: Record<string, string> = {
  NET_30: "Net 30",
  NET_45: "Net 45",
  NET_60: "Net 60",
};

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  RETURNED: "Returned",
  SUBMITTED_TO_PAYROLL: "In Payroll",
  PROCESSED: "Processed",
  PAID: "Paid",
  VOIDED: "Voided",
};

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  RETURNED: "bg-red-100 text-red-800",
  SUBMITTED_TO_PAYROLL: "bg-purple-100 text-purple-800",
  PROCESSED: "bg-emerald-100 text-emerald-800",
  PAID: "bg-teal-100 text-teal-800",
  VOIDED: "bg-gray-200 text-gray-500",
};
