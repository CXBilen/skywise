import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const tripStatusEnum = pgEnum("trip_status", [
  "draft",
  "booked",
  "confirmed",
  "cancelled",
  "completed",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const confidenceLevelEnum = pgEnum("confidence_level", [
  "high",
  "medium",
  "low",
]);

export const conflictStatusEnum = pgEnum("conflict_status", [
  "detected",
  "resolved",
  "ignored",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  homeAirport: text("home_airport"),
  seatPreference: text("seat_preference"),
  airlinePreferences: jsonb("airline_preferences").$type<string[]>(),
  emailConnected: boolean("email_connected").default(false),
  calendarConnected: boolean("calendar_connected").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trips table
export const trips = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: tripStatusEnum("status").default("draft").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  isRoundTrip: boolean("is_round_trip").default(true),
  totalPrice: integer("total_price"), // in cents
  currency: text("currency").default("USD"),
  source: text("source").default("chat"), // 'chat', 'email_import', 'manual'
  calendarEventIds: jsonb("calendar_event_ids").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flights table
export const flights = pgTable("flights", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .references(() => trips.id, { onDelete: "cascade" })
    .notNull(),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  departureAirport: text("departure_airport").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: integer("duration"), // in minutes
  stops: integer("stops").default(0),
  price: integer("price"), // in cents
  seatClass: text("seat_class").default("economy"),
  confirmationNumber: text("confirmation_number"),
  isOutbound: boolean("is_outbound").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Conversations table
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<{
    flightOptions?: FlightOption[];
    tripSummary?: TripSummary;
    conflictInfo?: ConflictInfo;
    importedTrip?: ImportedTrip;
    actions?: MessageAction[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Imported emails table
export const importedEmails = pgTable("imported_emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  emailId: text("email_id").notNull(),
  subject: text("subject"),
  sender: text("sender"),
  receivedAt: timestamp("received_at"),
  extractedData: jsonb("extracted_data").$type<ExtractedFlightData>(),
  confidence: confidenceLevelEnum("confidence").default("medium"),
  processed: boolean("processed").default(false),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Calendar conflicts table
export const calendarConflicts = pgTable("calendar_conflicts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "cascade" }),
  flightId: uuid("flight_id").references(() => flights.id, {
    onDelete: "cascade",
  }),
  conflictingEventId: text("conflicting_event_id").notNull(),
  conflictingEventTitle: text("conflicting_event_title"),
  conflictingEventStart: timestamp("conflicting_event_start").notNull(),
  conflictingEventEnd: timestamp("conflicting_event_end").notNull(),
  status: conflictStatusEnum("status").default("detected").notNull(),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Undo actions table (for reversibility)
export const undoActions = pgTable("undo_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  actionType: text("action_type").notNull(), // 'calendar_add', 'booking', etc.
  targetId: text("target_id").notNull(),
  previousState: jsonb("previous_state"),
  expiresAt: timestamp("expires_at").notNull(),
  undone: boolean("undone").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types for JSONB fields
export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price: number;
  calendarFit: "fits" | "conflict" | "unknown";
  conflictDetails?: string;
}

export interface TripSummary {
  origin: string;
  destination: string;
  outbound: {
    date: string;
    time: string;
    airline: string;
    flightNumber: string;
    duration: string;
  };
  return?: {
    date: string;
    time: string;
    airline: string;
    flightNumber: string;
    duration: string;
  };
  totalPrice: number;
  calendarEvents: {
    title: string;
    start: string;
    end: string;
  }[];
}

export interface ConflictInfo {
  flightTime: string;
  conflictingEvent: {
    id: string;
    title: string;
    start: string;
    end: string;
  };
  options: ("find_alternatives" | "book_anyway" | "show_details")[];
}

export interface ImportedTrip {
  source: string;
  airline: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  departureAirport: string;
  arrivalAirport: string;
  confidence: {
    airline: "high" | "medium" | "low";
    flightNumber: "high" | "medium" | "low";
    date: "high" | "medium" | "low";
    departureTime: "high" | "medium" | "low";
    airports: "high" | "medium" | "low";
  };
}

export interface ExtractedFlightData {
  airline?: string;
  flightNumber?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  confirmationNumber?: string;
  passengerName?: string;
}

export interface MessageAction {
  id: string;
  type: "select" | "confirm" | "edit" | "dismiss" | "undo";
  label: string;
  variant?: "primary" | "secondary" | "destructive";
  data?: Record<string, unknown>;
}

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type ImportedEmail = typeof importedEmails.$inferSelect;
export type CalendarConflict = typeof calendarConflicts.$inferSelect;
export type UndoAction = typeof undoActions.$inferSelect;
