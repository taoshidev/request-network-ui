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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const consumers = pgTable("consumers", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => users.id),

  stripeCustomerId: varchar("stripeCustomerId"),
  stripePriceId: varchar("stripePriceId"),
  currentCartId: varchar("currentCartId"),
  stripeCurrentPeriodEnd: varchar("stripeCurrentPeriodEnd"),
  stripeSubscriptionId: varchar("stripeSubscriptionId"),
});

export const validators = pgTable("validators", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => users.id),

  endpoint: varchar("endpoint").notNull(),
  hotkey: varchar("hotkey").notNull(),

  vtrust: numeric("vtrust", { precision: 7, scale: 5 }),
});

export const validatorsRelations = relations(validators, ({ one }) => ({
  settings: one(settings, {
    fields: [validators.id],
    references: [settings.id],
  }),
}));

export const settings = pgTable("settings", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => validators.id),

  enabled: boolean("enabled").notNull().default(true).notNull(),
  expires: timestamp("expires"),
  limit: integer("limit").default(10), // The total amount of burstable requests.
  refillRate: integer("refill_rate").default(1), // The amount of requests that are refilled every refillInterval.
  refillInterval: integer("refill_interval").default(1000), // The interval at which the limit is refilled.
  remaining: integer("remaining").default(1000),
});
