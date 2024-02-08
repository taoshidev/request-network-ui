import { pgTable, uuid, varchar, numeric, pgSchema } from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
  role: varchar("role", { length: 255 }),
  email: varchar("email", { length: 255 }),
});

export const consumers = pgTable("Consumers", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  fullname: varchar("fullname"),
  username: varchar("username"),
  phone: varchar("phone", { length: 256 }),
});

export const validators = pgTable("Validators", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  endpoint: varchar("endpoint"),
  vtrust: numeric("vtrust", { precision: 7, scale: 5 }),
  hotkey: varchar("hotkey"),
  coldkey: varchar("coldkey"),
});
