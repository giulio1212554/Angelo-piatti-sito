// Helper condivisi (client-safe) per prenotazioni e sala.

export const LUNCH_SLOTS = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
] as const;
export const DINNER_SLOTS = [] as const;

export const ALL_SLOTS: string[] = [...LUNCH_SLOTS];

export type SlotAvailability = {
  time: string;
  available: boolean;
  freeSeats: number;
};

export type TableStatus = "free" | "reserved" | "seated";

export type FloorTable = {
  id: number;
  label: string;
  capacity: number;
  zone: string;
  span: number;
  status: TableStatus;
  guestName: string | null;
  guestCount: number | null;
  time: string | null;
  code: string | null;
};

export type DayStats = {
  tablesBooked: number;
  covers: number;
  adults: number;
  children: number;
  occupancy: number;
  totalTables: number;
};

export type ReservationTicket = {
  code: string;
  guestName: string;
  phone: string;
  resDate: string;
  resTime: string;
  adults: number;
  children: number;
  status: string;
  tableLabels: string[];
  zone: string;
};

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const MONTHS = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function formatDateIt(iso: string): string {
  const date = parseISODate(iso);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatWeekdayShort(iso: string): string {
  return WEEKDAYS[parseISODate(iso).getDay()] ?? "";
}

export function shortTime(value: string): string {
  return value.slice(0, 5);
}

export function nextDays(count: number, from = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    out.push(toISODate(d));
  }
  return out;
}

export function describeParty(adults: number, children: number): string {
  const a = `${adults} ${adults === 1 ? "adulto" : "adulti"}`;
  if (children <= 0) return a;
  return `${a} · ${children} ${children === 1 ? "bambino" : "bambini"}`;
}
