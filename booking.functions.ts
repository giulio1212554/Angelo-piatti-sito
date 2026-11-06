import { createServerFn } from "@tanstack/react-start";

import {
  ALL_SLOTS,
  type DayStats,
  type FloorTable,
  type ReservationTicket,
  type SlotAvailability,
  type TableStatus,
  nextDays,
  shortTime,
} from "./booking";
import {
  deleteReservation,
  getAllReservationsInRange,
  getReservationByCode,
  getReservationsForDate,
  getSettings,
  getTables,
  insertReservation,
  updateReservation,
  type ReservationRow,
  type TableRow,
} from "./local-db";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function minutes(time: string): number {
  const [h, m] = shortTime(time).split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function overlaps(a: string, b: string, duration: number): boolean {
  return Math.abs(minutes(a) - minutes(b)) < duration;
}

/** Assegnazione algoritmica: tavolo più piccolo capiente, altrimenti unione di adiacenti. */
function assignTables(free: TableRow[], party: number): number[] | null {
  const singles = free
    .filter((t) => t.capacity >= party)
    .sort((a, b) => a.capacity - b.capacity || a.sort_order - b.sort_order);
  if (singles[0]) return [singles[0].id];

  const groups = new Map<string, TableRow[]>();
  for (const t of free) {
    const list = groups.get(t.adj_group) ?? [];
    list.push(t);
    groups.set(t.adj_group, list);
  }

  let best: { ids: number[]; seats: number } | null = null;
  for (const list of groups.values()) {
    const sorted = [...list].sort((a, b) => a.sort_order - b.sort_order);
    for (let start = 0; start < sorted.length; start += 1) {
      let seats = 0;
      const ids: number[] = [];
      for (let end = start; end < Math.min(start + 3, sorted.length); end += 1) {
        const row = sorted[end]!;
        seats += row.capacity;
        ids.push(row.id);
        if (seats >= party) {
          if (!best || seats < best.seats || ids.length < best.ids.length) {
            best = { ids: [...ids], seats };
          }
          break;
        }
      }
    }
  }
  return best ? best.ids : null;
}

function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `PL-${out}`;
}

type Ctx = {
  tables: TableRow[];
  reservations: ReservationRow[];
  duration: number;
  leadTime: number;
};

function loadContext(date: string): Ctx {
  const settings = getSettings();
  return {
    tables: getTables(),
    reservations: getReservationsForDate(date),
    duration: settings.slot_duration_minutes ?? 120,
    leadTime: settings.lead_time_minutes ?? 0,
  };
}

function freeTablesAt(ctx: Ctx, time: string): TableRow[] {
  const busy = new Set<number>();
  for (const r of ctx.reservations) {
    if (overlaps(r.res_time, time, ctx.duration)) {
      for (const id of r.table_ids) busy.add(id);
    }
  }
  return ctx.tables.filter((t) => !busy.has(t.id));
}

function isTooLate(date: string, time: string, leadTime: number): boolean {
  if (leadTime <= 0) return false;
  const now = new Date();
  const [y, m, d] = date.split("-").map(Number);
  const slot = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
  slot.setMinutes(minutes(time));
  return slot.getTime() - now.getTime() < leadTime * 60 * 1000;
}

function validateDate(value: string): string {
  if (!ISO_DATE.test(value)) throw new Error("Data non valida");
  return value;
}

function toTicket(row: ReservationRow, tables: TableRow[]): ReservationTicket {
  const assigned = tables.filter((t) => row.table_ids.includes(t.id));
  return {
    code: row.code,
    guestName: row.guest_name,
    phone: row.phone,
    resDate: row.res_date,
    resTime: shortTime(row.res_time),
    adults: row.adults,
    children: row.children,
    status: row.status,
    tableLabels: assigned.map((t) => t.label),
    zone: assigned[0]?.zone ?? "Sala",
  };
}

/* ------------------------------ Disponibilità ------------------------------ */

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((input: { date: string; adults: number; children: number }) => ({
    date: validateDate(input.date),
    adults: Math.min(Math.max(Math.trunc(input.adults), 1), 20),
    children: Math.min(Math.max(Math.trunc(input.children), 0), 10),
  }))
  .handler(async ({ data }): Promise<{ slots: SlotAvailability[] }> => {
    const ctx = loadContext(data.date);
    const party = data.adults + data.children;

    const slots = ALL_SLOTS.map<SlotAvailability>((time) => {
      if (isTooLate(data.date, time, ctx.leadTime)) {
        return { time, available: false, freeSeats: 0 };
      }
      const free = freeTablesAt(ctx, time);
      return {
        time,
        available: assignTables(free, party) !== null,
        freeSeats: free.reduce((sum, t) => sum + t.capacity, 0),
      };
    });

    return { slots };
  });

/* ------------------------------ Prenotazione ------------------------------- */

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      date: string;
      time: string;
      adults: number;
      children: number;
      guestName: string;
      phone: string;
      notes?: string;
    }) => {
      const guestName = input.guestName.trim();
      const phone = input.phone.trim();
      if (guestName.length < 2 || guestName.length > 80) {
        throw new Error("Inserisci un nome valido");
      }
      if (phone.length < 6 || phone.length > 30) {
        throw new Error("Inserisci un telefono valido");
      }
      if (!ALL_SLOTS.includes(shortTime(input.time))) {
        throw new Error("Orario non valido");
      }
      return {
        date: validateDate(input.date),
        time: shortTime(input.time),
        adults: Math.min(Math.max(Math.trunc(input.adults), 1), 20),
        children: Math.min(Math.max(Math.trunc(input.children), 0), 10),
        guestName,
        phone,
        notes: (input.notes ?? "").trim().slice(0, 300),
      };
    },
  )
  .handler(async ({ data }): Promise<ReservationTicket> => {
    const ctx = loadContext(data.date);
    if (isTooLate(data.date, data.time, ctx.leadTime)) {
      throw new Error("Questa fascia oraria non è più prenotabile");
    }

    const party = data.adults + data.children;
    const assigned = assignTables(freeTablesAt(ctx, data.time), party);
    if (!assigned) {
      throw new Error("Nessun tavolo disponibile per questo orario");
    }

    let inserted: ReservationRow | null = null;
    for (let attempt = 0; attempt < 8 && !inserted; attempt += 1) {
      const code = makeCode();
      if (getReservationByCode(code)) continue;
      inserted = insertReservation({
        code,
        guest_name: data.guestName,
        phone: data.phone,
        notes: data.notes || null,
        res_date: data.date,
        res_time: data.time,
        adults: data.adults,
        children: data.children,
        table_ids: assigned,
        status: "pending",
      });
    }
    if (!inserted) throw new Error("Impossibile completare la prenotazione");

    return toTicket(inserted, ctx.tables);
  });

/* --------------------------------- Ticket --------------------------------- */

export const getTicket = createServerFn({ method: "GET" })
  .inputValidator((input: { code: string }) => ({
    code: input.code.trim().toUpperCase().slice(0, 12),
  }))
  .handler(async ({ data }): Promise<ReservationTicket | null> => {
    const row = getReservationByCode(data.code);
    if (!row) return null;
    return toTicket(row, getTables());
  });

/* -------------------------------- Area staff ------------------------------- */

function assertPin(pin: string): void {
  const settings = getSettings();
  if (!settings || settings.admin_pin !== pin) {
    throw new Error("PIN non valido");
  }
}

function buildFloor(ctx: Ctx): FloorTable[] {
  return ctx.tables.map<FloorTable>((table) => {
    const booking = ctx.reservations
      .filter((r) => r.table_ids.includes(table.id))
      .sort((a, b) => minutes(a.res_time) - minutes(b.res_time))[0];

    let status: TableStatus = "free";
    if (booking) status = booking.status === "seated" ? "seated" : "reserved";

    return {
      id: table.id,
      label: table.label,
      capacity: table.capacity,
      zone: table.zone,
      span: table.span,
      status,
      guestName: booking?.guest_name ?? null,
      guestCount: booking ? booking.adults + booking.children : null,
      time: booking ? shortTime(booking.res_time) : null,
      code: booking?.code ?? null,
    };
  });
}

function buildStats(ctx: Ctx): DayStats {
  const adults = ctx.reservations.reduce((s, r) => s + r.adults, 0);
  const children = ctx.reservations.reduce((s, r) => s + r.children, 0);
  const tablesBooked = new Set(ctx.reservations.flatMap((r) => r.table_ids)).size;
  const totalSeats = ctx.tables.reduce((s, t) => s + t.capacity, 0) || 1;
  return {
    tablesBooked,
    covers: adults + children,
    adults,
    children,
    occupancy: Math.min(100, Math.round(((adults + children) / totalSeats) * 100)),
    totalTables: ctx.tables.length,
  };
}

export const verifyPin = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string }) => ({ pin: input.pin.trim().slice(0, 12) }))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    return { ok: true };
  });

export const getStaffDay = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string; date: string }) => ({
    pin: input.pin.trim().slice(0, 12),
    date: validateDate(input.date),
  }))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const ctx = loadContext(data.date);
    const week = nextDays(7);
    const weekRows = getAllReservationsInRange(week[0]!, week[6]!);

    const weekCovers = week.map((day) => ({
      date: day,
      covers: weekRows
        .filter((r) => r.res_date === day)
        .reduce((s, r) => s + r.adults + r.children, 0),
    }));

    return {
      floor: buildFloor(ctx),
      stats: buildStats(ctx),
      week: weekCovers,
      reservations: ctx.reservations
        .sort((a, b) => minutes(a.res_time) - minutes(b.res_time))
        .map((r) => ({
          code: r.code,
          guestName: r.guest_name,
          phone: r.phone,
          time: shortTime(r.res_time),
          adults: r.adults,
          children: r.children,
          status: r.status,
          tables: ctx.tables
            .filter((t) => r.table_ids.includes(t.id))
            .map((t) => t.label),
        })),
    };
  });

export const setReservationStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string; code: string; status: string }) => {
    if (!["pending", "seated", "cancelled"].includes(input.status)) {
      throw new Error("Stato non valido");
    }
    return {
      pin: input.pin.trim().slice(0, 12),
      code: input.code.trim().toUpperCase().slice(0, 12),
      status: input.status,
    };
  })
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const updated = updateReservation(data.code, { status: data.status });
    if (!updated) throw new Error("Prenotazione non trovata");
    return { ok: true };
  });

export const exportDayCsv = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string; date: string }) => ({
    pin: input.pin.trim().slice(0, 12),
    date: validateDate(input.date),
  }))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const ctx = loadContext(data.date);
    const header = [
      "Codice",
      "Nome",
      "Telefono",
      "Data",
      "Ora",
      "Adulti",
      "Bambini",
      "Tavoli",
      "Stato",
    ];
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = ctx.reservations
      .sort((a, b) => minutes(a.res_time) - minutes(b.res_time))
      .map((r) =>
        [
          r.code,
          r.guest_name,
          r.phone,
          r.res_date,
          shortTime(r.res_time),
          String(r.adults),
          String(r.children),
          ctx.tables
            .filter((t) => r.table_ids.includes(t.id))
            .map((t) => t.label)
            .join(" + "),
          r.status,
        ]
          .map(escape)
          .join(","),
      );
    return { csv: [header.map(escape).join(","), ...rows].join("\n") };
  });

/* --------------------- Staff: crea / elimina / modifica -------------------- */

export const staffCreateReservation = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      pin: string;
      date: string;
      time: string;
      adults: number;
      children: number;
      guestName: string;
      phone: string;
    }) => {
      const guestName = input.guestName.trim();
      const phone = input.phone.trim();
      if (guestName.length < 2 || guestName.length > 80) {
        throw new Error("Inserisci un nome valido");
      }
      if (phone.length < 6 || phone.length > 30) {
        throw new Error("Inserisci un telefono valido");
      }
      if (!ALL_SLOTS.includes(shortTime(input.time))) {
        throw new Error("Orario non valido");
      }
      return {
        pin: input.pin.trim().slice(0, 12),
        date: validateDate(input.date),
        time: shortTime(input.time),
        adults: Math.min(Math.max(Math.trunc(input.adults), 1), 20),
        children: Math.min(Math.max(Math.trunc(input.children), 0), 10),
        guestName,
        phone,
      };
    },
  )
  .handler(async ({ data }): Promise<ReservationTicket> => {
    assertPin(data.pin);
    const ctx = loadContext(data.date);
    const party = data.adults + data.children;
    const assigned = assignTables(freeTablesAt(ctx, data.time), party);
    if (!assigned) {
      throw new Error("Nessun tavolo disponibile per questo orario");
    }

    let inserted: ReservationRow | null = null;
    for (let attempt = 0; attempt < 8 && !inserted; attempt += 1) {
      const code = makeCode();
      if (getReservationByCode(code)) continue;
      inserted = insertReservation({
        code,
        guest_name: data.guestName,
        phone: data.phone,
        res_date: data.date,
        res_time: data.time,
        adults: data.adults,
        children: data.children,
        table_ids: assigned,
        status: "pending",
      });
    }
    if (!inserted) throw new Error("Impossibile completare la prenotazione");
    return toTicket(inserted, ctx.tables);
  });

export const staffDeleteReservation = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string; code: string }) => ({
    pin: input.pin.trim().slice(0, 12),
    code: input.code.trim().toUpperCase().slice(0, 12),
  }))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const ok = deleteReservation(data.code);
    if (!ok) throw new Error("Prenotazione non trovata");
    return { ok: true };
  });

export const staffUpdateReservation = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      pin: string;
      code: string;
      date?: string;
      time?: string;
      adults?: number;
      children?: number;
      guestName?: string;
      phone?: string;
      status?: string;
    }) => {
      if (input.status && !["pending", "seated", "cancelled"].includes(input.status)) {
        throw new Error("Stato non valido");
      }
      if (input.time && !ALL_SLOTS.includes(shortTime(input.time))) {
        throw new Error("Orario non valido");
      }
      return {
        pin: input.pin.trim().slice(0, 12),
        code: input.code.trim().toUpperCase().slice(0, 12),
        date: input.date ? validateDate(input.date) : undefined,
        time: input.time ? shortTime(input.time) : undefined,
        adults:
          input.adults !== undefined
            ? Math.min(Math.max(Math.trunc(input.adults), 1), 20)
            : undefined,
        children:
          input.children !== undefined
            ? Math.min(Math.max(Math.trunc(input.children), 0), 10)
            : undefined,
        guestName: input.guestName?.trim().slice(0, 80),
        phone: input.phone?.trim().slice(0, 30),
        status: input.status,
      };
    },
  )
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const existing = getReservationByCode(data.code);
    if (!existing) throw new Error("Prenotazione non trovata");

    const updates: Partial<ReservationRow> = {};
    if (data.guestName) updates.guest_name = data.guestName;
    if (data.phone) updates.phone = data.phone;
    if (data.status) updates.status = data.status;

    if (data.date || data.time || data.adults !== undefined || data.children !== undefined) {
      const newDate = data.date ?? existing.res_date;
      const newTime = data.time ?? shortTime(existing.res_time);
      const newAdults = data.adults ?? existing.adults;
      const newChildren = data.children ?? existing.children;
      const party = newAdults + newChildren;

      const ctx = loadContext(newDate);
      ctx.reservations = ctx.reservations.filter((r) => r.code !== data.code);
      const assigned = assignTables(freeTablesAt(ctx, newTime), party);
      if (!assigned) {
        throw new Error("Nessun tavolo disponibile per il nuovo orario/persone");
      }
      updates.table_ids = assigned;
      updates.res_date = newDate;
      updates.res_time = newTime;
      updates.adults = newAdults;
      updates.children = newChildren;
    }

    const updated = updateReservation(data.code, updates);
    if (!updated) throw new Error("Prenotazione non trovata");
    return { ok: true };
  });

/* --------------------- Cliente: cerca / cancella / modifica -------------------- */

export const guestCancelReservation = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string; phone: string }) => {
    const phone = input.phone.trim();
    if (phone.length < 6) throw new Error("Inserisci il telefono usato in prenotazione");
    return {
      code: input.code.trim().toUpperCase().slice(0, 12),
      phone,
    };
  })
  .handler(async ({ data }) => {
    const existing = getReservationByCode(data.code);
    if (!existing) throw new Error("Prenotazione non trovata");
    const phoneOk =
      existing.phone.replace(/\s/g, "") === data.phone.replace(/\s/g, "") ||
      existing.phone.replace(/\s/g, "").endsWith(data.phone.replace(/\s/g, "").slice(-6));
    if (!phoneOk) throw new Error("Telefono non corrispondente");
    if (existing.status === "cancelled") throw new Error("Prenotazione già annullata");
    if (existing.status === "seated") throw new Error("Non puoi annullare: sei già in sala");
    updateReservation(data.code, { status: "cancelled" });
    return { ok: true };
  });

export const guestUpdateReservation = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      code: string;
      phone: string;
      date?: string;
      time?: string;
      adults?: number;
      children?: number;
    }) => {
      if (input.time && !ALL_SLOTS.includes(shortTime(input.time))) {
        throw new Error("Orario non valido");
      }
      return {
        code: input.code.trim().toUpperCase().slice(0, 12),
        phone: input.phone.trim(),
        date: input.date ? validateDate(input.date) : undefined,
        time: input.time ? shortTime(input.time) : undefined,
        adults:
          input.adults !== undefined
            ? Math.min(Math.max(Math.trunc(input.adults), 1), 20)
            : undefined,
        children:
          input.children !== undefined
            ? Math.min(Math.max(Math.trunc(input.children), 0), 10)
            : undefined,
      };
    },
  )
  .handler(async ({ data }): Promise<ReservationTicket> => {
    const existing = getReservationByCode(data.code);
    if (!existing) throw new Error("Prenotazione non trovata");
    const phoneOk =
      existing.phone.replace(/\s/g, "") === data.phone.replace(/\s/g, "") ||
      existing.phone.replace(/\s/g, "").endsWith(data.phone.replace(/\s/g, "").slice(-6));
    if (!phoneOk) throw new Error("Telefono non corrispondente");
    if (existing.status === "cancelled") throw new Error("Prenotazione annullata");
    if (existing.status === "seated") throw new Error("Non puoi modificare: sei già in sala");

    const newDate = data.date ?? existing.res_date;
    const newTime = data.time ?? shortTime(existing.res_time);
    const newAdults = data.adults ?? existing.adults;
    const newChildren = data.children ?? existing.children;
    const party = newAdults + newChildren;

    const ctx = loadContext(newDate);
    ctx.reservations = ctx.reservations.filter((r) => r.code !== data.code);
    if (isTooLate(newDate, newTime, ctx.leadTime)) {
      throw new Error("Questa fascia oraria non è più modificabile");
    }
    const assigned = assignTables(freeTablesAt(ctx, newTime), party);
    if (!assigned) {
      throw new Error("Nessun tavolo disponibile per il nuovo orario/persone");
    }

    const updated = updateReservation(data.code, {
      res_date: newDate,
      res_time: newTime,
      adults: newAdults,
      children: newChildren,
      table_ids: assigned,
    });
    if (!updated) throw new Error("Impossibile aggiornare");
    return toTicket(updated, getTables());
  });
