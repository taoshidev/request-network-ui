import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  numeric,
  pgSchema,
  timestamp,
  integer,
  boolean,
  pgEnum,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const roleEnum = pgEnum("role", ["consumer", "validator"]);

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
  role: roleEnum("role").notNull().default("consumer"),
  email: varchar("email", { length: 255 }),
  fullname: varchar("fullname"),
  username: varchar("username"),
  phone: varchar("phone", { length: 256 }),
  onboarded: boolean("onboarded").notNull().default(false),
  onboardingStep: integer("onboardingStep").notNull().default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  validators: many(validators),
}));

export const subnets = pgTable("subnets", {
  value: uuid("id").primaryKey(),
  label: varchar("label"),
});

export const subnetsRelations = relations(subnets, ({ many }) => ({
  validators: many(validators),
}));

export const validators = pgTable("validators", {
  id: uuid("id").primaryKey().notNull(),

  hotkey: varchar("hotkey", { length: 48 }).unique().notNull(),

  subnetId: uuid("subnet_id")
    .notNull()
    .references(() => subnets.value),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  account: jsonb('account'),
  signature: varchar("signature"),
  vtrust: numeric("vtrust", { precision: 7, scale: 5 }),
  verified: boolean("verified").notNull().default(false),
});

export const validatorsRelations = relations(validators, ({ many, one }) => ({
  endpoints: many(endpoints),
  user: one(users, {
    fields: [validators.userId],
    references: [users.id],
  }),
  subnets: one(subnets, {
    fields: [validators.subnetId],
    references: [subnets.value],
  }),
}));

export const endpoints = pgTable(
  "endpoints",
  {
    id: uuid("id").primaryKey().notNull(),

    subnet: uuid("subnet")
      .notNull()
      .references(() => subnets.value),
    validator: uuid("validator")
      .notNull()
      .references(() => validators.id),

    limit: integer("limit").default(10), // The total amount of burstable requests.
    url: varchar("url").unique().notNull(),
    enabled: boolean("enabled").notNull().default(true).notNull(),
    expires: timestamp("expires"),
    refillRate: integer("refill_rate").default(1), // The amount of requests that are refilled every refillInterval.
    refillInterval: integer("refill_interval").default(1000), // The interval at which the limit is refilled.
    remaining: integer("remaining").default(1000),
  },
  (table) => ({
    unique: unique().on(table.validator, table.subnet),
  }),
);

export const endpointsRelations = relations(endpoints, ({ one }) => ({
  subnets: one(subnets, {
    fields: [endpoints.subnet],
    references: [subnets.value],
  }),
  validators: one(validators, {
    fields: [endpoints.validator],
    references: [validators.id],
  }),
}));
