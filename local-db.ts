import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type TableRow = {
  id: number;
  label: string;
  capacity: number;
  zone: string;
  adj_group: string;
  span: number;
  sort_order: number;
};

export type ReservationRow = {
  id: string;
  code: string;
  guest_name: string;
  phone: string;
  notes?: string | null;
  res_date: string;
  res_time: string;
  adults: number;
  children: number;
  table_ids: number[];
  status: string;
  created_at?: string;
};

export type AppSettings = {
  id: number;
  admin_pin: string;
  slot_duration_minutes: number;
  lead_time_minutes: number;
};

export type StaffRole = "dirigente" | "cuoco" | "cassiere" | "cameriere";

export type StaffUser = {
  id: string;
  username: string;
  password: string;
  name: string;
  role: StaffRole;
  active: boolean;
};

export type MenuItemRow = {
  id: string;
  section: string;
  name: string;
  price: number;
  desc: string;
  available: boolean;
};

export type OrderStatus = "pending" | "preparing" | "ready" | "served" | "paid" | "cancelled";

export type OrderItem = {
  id: string;
  tableId: number;
  tableLabel: string;
  dishId: string;
  dishName: string;
  basePrice: number;
  qty: number;
  /** Note: aggiunte / cose da levare */
  mods: string;
  status: OrderStatus;
  createdAt: string;
  createdBy: string;
  readyAt?: string | null;
  paidAt?: string | null;
};

export type ChatMessage = {
  id: string;
  fromId: string;
  fromName: string;
  /** "all" oppure id utente staff */
  toId: string;
  text: string;
  createdAt: string;
  readBy: string[];
};

export type Solution = {
  id: string;
  title: string;
  description: string;
  price: string;
  active: boolean;
};

type DbShape = {
  settings: AppSettings;
  tables: TableRow[];
  reservations: ReservationRow[];
  staff: StaffUser[];
  menu: MenuItemRow[];
  orders: OrderItem[];
  messages: ChatMessage[];
  solutions: Solution[];
};

const DATA_DIR = join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "db.json");

const DEFAULT_TABLES: TableRow[] = [
  { id: 1, label: "T1", capacity: 2, zone: "Terrazza", adj_group: "T", span: 1, sort_order: 1 },
  { id: 2, label: "T2", capacity: 2, zone: "Terrazza", adj_group: "T", span: 1, sort_order: 2 },
  { id: 3, label: "T3", capacity: 4, zone: "Terrazza", adj_group: "T", span: 1, sort_order: 3 },
  { id: 4, label: "T4", capacity: 4, zone: "Terrazza", adj_group: "T", span: 1, sort_order: 4 },
  { id: 5, label: "T5", capacity: 6, zone: "Terrazza", adj_group: "T", span: 2, sort_order: 5 },
  { id: 6, label: "S1", capacity: 2, zone: "Sala", adj_group: "S", span: 1, sort_order: 10 },
  { id: 7, label: "S2", capacity: 2, zone: "Sala", adj_group: "S", span: 1, sort_order: 11 },
  { id: 8, label: "S3", capacity: 4, zone: "Sala", adj_group: "S", span: 1, sort_order: 12 },
  { id: 9, label: "S4", capacity: 4, zone: "Sala", adj_group: "S", span: 1, sort_order: 13 },
  { id: 10, label: "S5", capacity: 6, zone: "Sala", adj_group: "S", span: 2, sort_order: 14 },
  { id: 11, label: "S6", capacity: 8, zone: "Sala", adj_group: "S", span: 2, sort_order: 15 },
];

const DEFAULT_STAFF: StaffUser[] = [
  {
    id: "u-dir",
    username: "dirigente",
    password: "dirigente123",
    name: "Dirigente",
    role: "dirigente",
    active: true,
  },
  {
    id: "u-cuoco",
    username: "cuoco",
    password: "cuoco123",
    name: "Cuoco",
    role: "cuoco",
    active: true,
  },
  {
    id: "u-cassa",
    username: "cassiere",
    password: "cassiere123",
    name: "Cassiere",
    role: "cassiere",
    active: true,
  },
  {
    id: "u-cam",
    username: "cameriere",
    password: "cameriere123",
    name: "Cameriere",
    role: "cameriere",
    active: true,
  },
];


const DEFAULT_SOLUTIONS: Solution[] = [
  {
    id: "sol-1",
    title: "Pranzo panoramico per 2",
    description: "Antipasto della casa, primo, secondo e acqua. Tavolo preferibilmente in terrazza.",
    price: "55 €",
    active: true,
  },
  {
    id: "sol-2",
    title: "Menu degustazione ischitano",
    description: "Percorso completo con coniglio all'ischitana e dolce della casa. Ideale per 2-4 persone.",
    price: "38 € a persona",
    active: true,
  },
  {
    id: "sol-3",
    title: "Celebrazioni e gruppi",
    description: "Organizzazione tavoli uniti, menu personalizzato e servizio dedicato. Contattaci su WhatsApp.",
    price: "su richiesta",
    active: true,
  },
];

const DEFAULT_MENU: MenuItemRow[] = [
  { id: "m1", section: "Antipasti", name: "Antipasto della casa", price: 14, desc: "Salumi e formaggi locali", available: true },
  { id: "m2", section: "Antipasti", name: "Insalata di mare", price: 16, desc: "Pesce fresco e limone", available: true },
  { id: "m3", section: "Antipasti", name: "Bruschette miste", price: 8, desc: "", available: true },
  { id: "m4", section: "Primi", name: "Bucatini al sugo di coniglio", price: 14, desc: "Classico ischitano", available: true },
  { id: "m5", section: "Primi", name: "Spaghetti alle vongole", price: 16, desc: "", available: true },
  { id: "m6", section: "Primi", name: "Paccheri ai frutti di mare", price: 18, desc: "", available: true },
  { id: "m7", section: "Secondi", name: "Coniglio all'ischitana", price: 22, desc: "Piatto simbolo", available: true },
  { id: "m8", section: "Secondi", name: "Pesce del giorno", price: 0, desc: "Su richiesta", available: true },
  { id: "m9", section: "Secondi", name: "Grigliata mista di carne", price: 20, desc: "", available: true },
  { id: "m10", section: "Contorni", name: "Patate al forno", price: 5, desc: "", available: true },
  { id: "m11", section: "Contorni", name: "Insalata mista", price: 5, desc: "", available: true },
  { id: "m12", section: "Dolci", name: "Tiramisù della casa", price: 6, desc: "", available: true },
  { id: "m13", section: "Dolci", name: "Caprese al limone", price: 6, desc: "", available: true },
  { id: "m14", section: "Bevande", name: "Acqua 1L", price: 2, desc: "", available: true },
  { id: "m15", section: "Bevande", name: "Vino della casa 0.5L", price: 8, desc: "", available: true },
  { id: "m16", section: "Bevande", name: "Caffè", price: 1.5, desc: "", available: true },
];

function defaultDb(): DbShape {
  return {
    settings: {
      id: 1,
      admin_pin: "1234",
      slot_duration_minutes: 120,
      lead_time_minutes: 0,
    },
    tables: DEFAULT_TABLES,
    reservations: [],
    staff: DEFAULT_STAFF,
    menu: DEFAULT_MENU,
    orders: [],
    messages: [],
    solutions: DEFAULT_SOLUTIONS,
  };
}

function ensureDb(): DbShape {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_PATH)) {
    const db = defaultDb();
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  }
  try {
    const raw = readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    const base = defaultDb();
    const db: DbShape = {
      settings: parsed.settings ?? base.settings,
      tables: parsed.tables?.length ? parsed.tables : base.tables,
      reservations: parsed.reservations ?? [],
      staff: parsed.staff?.length ? parsed.staff : base.staff,
      menu: parsed.menu?.length ? parsed.menu : base.menu,
      orders: parsed.orders ?? [],
      messages: parsed.messages ?? [],
      solutions: parsed.solutions?.length ? parsed.solutions : base.solutions,
    };
    // migrate missing fields
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  } catch {
    const db = defaultDb();
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  }
}

function saveDb(db: DbShape): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/* -------------------- prenotazioni / settings (esistenti) -------------------- */

export function getSettings(): AppSettings {
  return ensureDb().settings;
}

export function getTables(): TableRow[] {
  return [...ensureDb().tables].sort((a, b) => a.sort_order - b.sort_order);
}

export function getReservationsForDate(date: string): ReservationRow[] {
  return ensureDb().reservations.filter(
    (r) => r.res_date === date && r.status !== "cancelled",
  );
}

export function getAllReservationsInRange(from: string, to: string): ReservationRow[] {
  return ensureDb().reservations.filter(
    (r) => r.res_date >= from && r.res_date <= to && r.status !== "cancelled",
  );
}

export function getReservationByCode(code: string): ReservationRow | null {
  const normalized = code.trim().toUpperCase();
  return (
    ensureDb().reservations.find((r) => r.code.toUpperCase() === normalized) ?? null
  );
}

export function insertReservation(
  row: Omit<ReservationRow, "id" | "created_at">,
): ReservationRow {
  const db = ensureDb();
  const full: ReservationRow = {
    ...row,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  db.reservations.push(full);
  saveDb(db);
  return full;
}

export function updateReservation(
  code: string,
  updates: Partial<Omit<ReservationRow, "id" | "code">>,
): ReservationRow | null {
  const db = ensureDb();
  const idx = db.reservations.findIndex(
    (r) => r.code.toUpperCase() === code.trim().toUpperCase(),
  );
  if (idx < 0) return null;
  db.reservations[idx] = { ...db.reservations[idx]!, ...updates };
  saveDb(db);
  return db.reservations[idx]!;
}

export function deleteReservation(code: string): boolean {
  const db = ensureDb();
  const before = db.reservations.length;
  db.reservations = db.reservations.filter(
    (r) => r.code.toUpperCase() !== code.trim().toUpperCase(),
  );
  if (db.reservations.length === before) return false;
  saveDb(db);
  return true;
}

/* -------------------- staff accounts -------------------- */

export function listStaff(): StaffUser[] {
  return ensureDb().staff.map((s) => ({ ...s, password: "***" }));
}

export function listStaffFull(): StaffUser[] {
  return [...ensureDb().staff];
}

export function loginStaff(
  username: string,
  password: string,
): Omit<StaffUser, "password"> | null {
  const u = ensureDb().staff.find(
    (s) =>
      s.active &&
      s.username.toLowerCase() === username.trim().toLowerCase() &&
      s.password === password,
  );
  if (!u) return null;
  return { id: u.id, username: u.username, name: u.name, role: u.role, active: u.active };
}

export function createStaffUser(input: {
  username: string;
  password: string;
  name: string;
  role: StaffRole;
}): StaffUser {
  const db = ensureDb();
  if (db.staff.some((s) => s.username.toLowerCase() === input.username.toLowerCase())) {
    throw new Error("Username già esistente");
  }
  const user: StaffUser = {
    id: uid("u"),
    username: input.username.trim().toLowerCase(),
    password: input.password,
    name: input.name.trim(),
    role: input.role,
    active: true,
  };
  db.staff.push(user);
  saveDb(db);
  return user;
}

export function setStaffActive(id: string, active: boolean): void {
  const db = ensureDb();
  const u = db.staff.find((s) => s.id === id);
  if (!u) throw new Error("Utente non trovato");
  u.active = active;
  saveDb(db);
}

/* -------------------- menu runtime -------------------- */

export function getMenuItems(): MenuItemRow[] {
  return [...ensureDb().menu];
}

export function saveMenuItems(items: MenuItemRow[]): void {
  const db = ensureDb();
  db.menu = items;
  saveDb(db);
}

export function upsertMenuItem(item: Partial<MenuItemRow> & { name: string; section: string }): MenuItemRow {
  const db = ensureDb();
  if (item.id) {
    const idx = db.menu.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      db.menu[idx] = { ...db.menu[idx]!, ...item, id: item.id } as MenuItemRow;
      saveDb(db);
      return db.menu[idx]!;
    }
  }
  const row: MenuItemRow = {
    id: uid("m"),
    section: item.section,
    name: item.name,
    price: item.price ?? 0,
    desc: item.desc ?? "",
    available: item.available ?? true,
  };
  db.menu.push(row);
  saveDb(db);
  return row;
}

export function deleteMenuItem(id: string): void {
  const db = ensureDb();
  db.menu = db.menu.filter((m) => m.id !== id);
  saveDb(db);
}

/* -------------------- ordini -------------------- */

export function listOrders(filter?: {
  status?: OrderStatus | OrderStatus[];
  tableId?: number;
  openOnly?: boolean;
}): OrderItem[] {
  let list = [...ensureDb().orders];
  if (filter?.tableId != null) list = list.filter((o) => o.tableId === filter.tableId);
  if (filter?.status) {
    const set = new Set(Array.isArray(filter.status) ? filter.status : [filter.status]);
    list = list.filter((o) => set.has(o.status));
  }
  if (filter?.openOnly) {
    list = list.filter((o) => !["paid", "cancelled"].includes(o.status));
  }
  return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function addOrderItem(input: {
  tableId: number;
  tableLabel: string;
  dishId: string;
  dishName: string;
  basePrice: number;
  qty: number;
  mods: string;
  createdBy: string;
}): OrderItem {
  const db = ensureDb();
  const row: OrderItem = {
    id: uid("o"),
    tableId: input.tableId,
    tableLabel: input.tableLabel,
    dishId: input.dishId,
    dishName: input.dishName,
    basePrice: input.basePrice,
    qty: input.qty,
    mods: input.mods.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    readyAt: null,
    paidAt: null,
  };
  db.orders.push(row);
  saveDb(db);
  return row;
}

export function updateOrderStatus(id: string, status: OrderStatus): OrderItem {
  const db = ensureDb();
  const row = db.orders.find((o) => o.id === id);
  if (!row) throw new Error("Ordine non trovato");
  row.status = status;
  if (status === "ready") row.readyAt = new Date().toISOString();
  if (status === "paid") row.paidAt = new Date().toISOString();
  saveDb(db);
  return row;
}

export function markTablePaid(tableId: number): number {
  const db = ensureDb();
  let n = 0;
  const now = new Date().toISOString();
  for (const o of db.orders) {
    if (o.tableId === tableId && !["paid", "cancelled"].includes(o.status)) {
      o.status = "paid";
      o.paidAt = now;
      n += 1;
    }
  }
  saveDb(db);
  return n;
}

export function tableBill(tableId: number): {
  items: OrderItem[];
  total: number;
} {
  const items = listOrders({ tableId, openOnly: true });
  const total = items.reduce((s, o) => s + o.basePrice * o.qty, 0);
  return { items, total };
}

/* -------------------- chat -------------------- */

export function listMessages(forUserId: string): ChatMessage[] {
  return ensureDb()
    .messages.filter(
      (m) => m.toId === "all" || m.toId === forUserId || m.fromId === forUserId,
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(-200);
}

export function sendMessage(input: {
  fromId: string;
  fromName: string;
  toId: string;
  text: string;
}): ChatMessage {
  const db = ensureDb();
  const msg: ChatMessage = {
    id: uid("msg"),
    fromId: input.fromId,
    fromName: input.fromName,
    toId: input.toId,
    text: input.text.trim().slice(0, 1000),
    createdAt: new Date().toISOString(),
    readBy: [input.fromId],
  };
  db.messages.push(msg);
  // keep last 500
  if (db.messages.length > 500) db.messages = db.messages.slice(-500);
  saveDb(db);
  return msg;
}

/* -------------------- stats dirigente -------------------- */

export function weekSalesStats(days = 7): {
  byDay: { date: string; revenue: number; orders: number }[];
  topDishes: { name: string; qty: number; revenue: number }[];
  totalRevenue: number;
  totalOrders: number;
} {
  const db = ensureDb();
  const now = new Date();
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dates.push(iso);
  }
  const paid = db.orders.filter((o) => o.status === "paid" && o.paidAt);
  const byDay = dates.map((date) => {
    const dayOrders = paid.filter((o) => (o.paidAt ?? "").slice(0, 10) === date);
    return {
      date,
      revenue: dayOrders.reduce((s, o) => s + o.basePrice * o.qty, 0),
      orders: dayOrders.length,
    };
  });
  const dishMap = new Map<string, { qty: number; revenue: number }>();
  for (const o of paid) {
    const cur = dishMap.get(o.dishName) ?? { qty: 0, revenue: 0 };
    cur.qty += o.qty;
    cur.revenue += o.basePrice * o.qty;
    dishMap.set(o.dishName, cur);
  }
  const topDishes = [...dishMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);
  return {
    byDay,
    topDishes,
    totalRevenue: byDay.reduce((s, d) => s + d.revenue, 0),
    totalOrders: byDay.reduce((s, d) => s + d.orders, 0),
  };
}


/* -------------------- soluzioni -------------------- */

export function listSolutions(activeOnly = false): Solution[] {
  const list = [...ensureDb().solutions];
  return activeOnly ? list.filter((s) => s.active) : list;
}

export function upsertSolution(input: {
  id?: string;
  title: string;
  description: string;
  price: string;
  active?: boolean;
}): Solution {
  const db = ensureDb();
  if (input.id) {
    const idx = db.solutions.findIndex((s) => s.id === input.id);
    if (idx >= 0) {
      db.solutions[idx] = {
        ...db.solutions[idx]!,
        title: input.title,
        description: input.description,
        price: input.price,
        active: input.active ?? db.solutions[idx]!.active,
      };
      saveDb(db);
      return db.solutions[idx]!;
    }
  }
  const row: Solution = {
    id: uid("sol"),
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price.trim(),
    active: input.active ?? true,
  };
  db.solutions.push(row);
  saveDb(db);
  return row;
}

export function deleteSolution(id: string): void {
  const db = ensureDb();
  db.solutions = db.solutions.filter((s) => s.id !== id);
  saveDb(db);
}
