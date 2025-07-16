import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 25 }).notNull().unique(),
  email: varchar({ length: 128 }).notNull().unique(),
});
export const eventsTable = pgTable("event", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  datetime: timestamp("datetime", { mode: "string" }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  capacity: integer("capacity").notNull(),
});

export const registrationsTable = pgTable("registration", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  eventId: integer('event_id').references(() => eventsTable.id).notNull(),
});