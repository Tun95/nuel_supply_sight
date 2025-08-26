// types/data/datatype.ts
import { DateRangeChip } from "../date/daterange";

// Date range options
export const dateRanges: DateRangeChip[] = [
  { id: "7d", label: "7d", days: 7 },
  { id: "14d", label: "14d", days: 14 },
  { id: "30d", label: "30d", days: 30 },
];

export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const DELIVERY_STATUS = {
  PENDING_FEEDBACK: "Pending Feedback",
  FEEDBACK_RECEIVED: "Feedback Received",
  APPROVED: "Approved",
  REVISED: "Revised",
} as const;

export type DeliveryStatus =
  (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

export const statusColors: Record<DeliveryStatus, string> = {
  [DELIVERY_STATUS.PENDING_FEEDBACK]: "orange",
  [DELIVERY_STATUS.FEEDBACK_RECEIVED]: "blue",
  [DELIVERY_STATUS.APPROVED]: "green",
  [DELIVERY_STATUS.REVISED]: "purple",
};
