import { relations, sql } from "drizzle-orm";
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

// TODO - All IDS should be auto generated
export const users = authSchema.table("users", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
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

// TODO: Value because maintine select takes label and value
export const subnets = pgTable("subnets", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  netUid: integer("net_uid"),
  label: varchar("label"),
});

export const subnetsRelations = relations(subnets, ({ many }) => ({
  endpoints: many(endpoints),
  validators: many(validators),
}));

export const validators = pgTable("validators", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  name: varchar("name"),
  description: varchar("description"),
  baseApiUrl: varchar("base_api_url").unique().notNull(),
  apiPrefix: varchar("api_prefix"),
  apiId: varchar("api_id"),
  apiKey: varchar("api_key"),
  apiSecret: varchar("api_secret"),
  hotkey: varchar("hotkey", { length: 48 }).unique().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  account: jsonb("account"),
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
}));

export const endpoints = pgTable(
  "endpoints",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    subnetId: uuid("subnet_id") // subnet becomes subnetId
      .notNull()
      .references(() => subnets.id, { onDelete: "cascade" }),
    validatorId: uuid("validator_id") // validator becomes validatorId
      .notNull()
      .references(() => validators.id, { onDelete: "cascade" }),
    price: varchar("price"),
    currencyType: varchar("currency_type"),
    walletAddress: varchar("wallet_address"),
    limit: integer("limit").default(10), // The total amount of burstable requests.
    url: varchar("url").unique().notNull(),
    enabled: boolean("enabled").notNull().default(true).notNull(),
    expires: timestamp("expires"),
    refillRate: integer("refill_rate").default(1), // The amount of requests that are refilled every refillInterval.
    refillInterval: integer("refill_interval").default(1000), // The interval at which the limit is refilled.
    remaining: integer("remaining").default(1000),
  },
  (table) => ({
    unique: unique().on(table.validatorId, table.subnetId), // endpoints.validator becomes endpoint.validatorId
  })
);

export const endpointsRelations = relations(endpoints, ({ one }) => ({
  subnet: one(subnets, { // subnets becomes subnet
    fields: [endpoints.subnetId], // endpoint.subnet becomes endpoint.subnetId
    references: [subnets.id],
  }),
  validator: one(validators, { // validators becomes validator
    fields: [endpoints.validatorId], // endpoints.validator becomes endpoint.validatorId
    references: [validators.id],
  }),
}));

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    endpointId: uuid("endpoint_id").references(() => endpoints.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    serviceId: varchar("service_id"),
    keyId: varchar("key_id"),
    apiKey: varchar("api_key"),
    apiSecret: varchar("api_secret"),
    appName: varchar("app_name"),
    consumerApiUrl: varchar("consumer_api_url").notNull(),
    consumerWalletAddress: varchar("consumer_wallet_address"),
  },
  (table) => ({
    unique: unique().on(table.endpointId, table.userId),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  endpoint: one(endpoints, {
    fields: [subscriptions.endpointId],
    references: [endpoints.id],
  }),
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const userSubscriptionRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const userSubscriptionEndpointRelations = relations(
  endpoints,
  ({ many }) => ({
    endpoints: many(endpoints),
  })
);
