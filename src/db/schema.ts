import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  pgSchema,
  timestamp,
  integer,
  boolean,
  pgEnum,
  unique,
  jsonb,
  text,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const roleEnum = pgEnum("role", ["consumer", "validator"]);
export const currencyTypeEnum = pgEnum("currency_type", [
  "FIAT",
  "USDC",
  "USDT",
]);

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
  stripeEnabled: boolean("stripe_enabled").default(true),
  cryptoEnabled: boolean("crypto_enabled").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  validators: many(validators),
  contracts: many(contracts),
  services: many(services),
  userNotifications: many(userNotifications),
}));

export const contracts = pgTable("contracts", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull().default(""),
  content: text("content").notNull().default(""),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  updatedAt: timestamp("updated_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
});

export const contractUserRelations = relations(contracts, ({ many, one }) => ({
  user: one(users, {
    fields: [contracts.userId],
    references: [users.id],
  }),
  services: many(services),
}));

export const subnets = pgTable("subnets", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  netUid: integer("net_uid"),
  label: varchar("label"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  updatedAt: timestamp("updated_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
});

export const subnetsRelations = relations(subnets, ({ many }) => ({
  endpoints: many(endpoints),
  validators: many(validators),
  subscriptions: many(subscriptions),
}));

export const validators = pgTable("validators", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  bittensorUid: integer("bittensor_uid"),
  bittensorNetUid: integer("bittensor_net_uid"),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  baseApiUrl: varchar("base_api_url").unique().notNull(),
  apiPrefix: varchar("api_prefix"),
  apiId: varchar("api_id"),
  apiKey: varchar("api_key"),
  apiSecret: varchar("api_secret"),
  walletAddress: varchar("wallet_address").unique(),
  hotkey: varchar("hotkey", { length: 48 }).unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  account: jsonb("account"),
  signature: varchar("signature"),
  verified: boolean("verified").notNull().default(false),
  stripeEnabled: boolean("stripe_enabled").default(true),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  updatedAt: timestamp("updated_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
});

export const validatorsRelations = relations(validators, ({ many, one }) => ({
  endpoints: many(endpoints),
  subscriptions: many(subscriptions),
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
    subnetId: uuid("subnet_id")
      .notNull()
      .references(() => subnets.id, { onDelete: "cascade" }),
    validatorId: uuid("validator_id")
      .notNull()
      .references(() => validators.id, { onDelete: "cascade" }),
    contractId: uuid("contract_id").references(() => contracts.id, {
      onDelete: "set null",
    }),
    url: varchar("url").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    }).default(sql`now()`),
    updatedAt: timestamp("updated_at", {
      precision: 6,
      withTimezone: true,
    }).default(sql`now()`),
    deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
  },
  (table) => ({
    unique: unique().on(table.validatorId, table.url),
  })
);

export const services = pgTable("services", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contracts.id, { onDelete: "set null" }),
  name: varchar("name"),
  price: varchar("price"),
  currencyType: currencyTypeEnum("currency_type").notNull().default("USDC"),
  limit: integer("limit").default(10),
  expires: timestamp("expires"),
  refillRate: integer("refill_rate").default(1),
  refillInterval: integer("refill_interval").default(1000),
  remaining: integer("remaining").default(1000),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  updatedAt: timestamp("updated_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
});

export const serviceRelations = relations(services, ({ many, one }) => ({
  contract: one(contracts, {
    fields: [services.contractId],
    references: [contracts.id],
  }),
  user: one(users, {
    fields: [services.userId],
    references: [users.id],
  }),
}));

export const endpointsRelations = relations(endpoints, ({ many, one }) => ({
  subscriptions: many(subscriptions),
  subnet: one(subnets, {
    fields: [endpoints.subnetId],
    references: [subnets.id],
  }),
  validator: one(validators, {
    fields: [endpoints.validatorId],
    references: [validators.id],
  }),
  contract: one(contracts, {
    fields: [endpoints.contractId],
    references: [contracts.id],
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
    subnetId: uuid("subnet_id").references(() => subnets.id, {
      onDelete: "set null",
    }),
    validatorId: uuid("validator_id").references(() => validators.id, {
      onDelete: "set null",
    }),
    proxyServiceId: varchar("proxy_service_id"),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    contractId: uuid("contract_id").references(() => contracts.id, {
      onDelete: "set null",
    }),
    keyId: varchar("key_id"),
    reqKey: varchar("req_key"),
    apiKey: varchar("api_key"),
    apiSecret: varchar("api_secret"),
    appName: varchar("app_name").unique(),
    consumerApiUrl: varchar("consumer_api_url").notNull(),
    consumerWalletAddress: varchar("consumer_wallet_address"),
    termsAccepted: boolean("terms_accepted").default(true).notNull(),
    active: boolean("active").default(false).notNull(),
    createdAt: timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    }).default(sql`now()`),
    updatedAt: timestamp("updated_at", {
      precision: 6,
      withTimezone: true,
    }).default(sql`now()`),
    deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
  },
  (table) => ({
    unique: unique().on(table.endpointId, table.userId),
  })
);

export const notificationTypeEnum = pgEnum("type", [
  "success",
  "info",
  "warning",
  "danger",
  "bug",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  fromUserId: uuid("from_user_id")
    .references(() => users.id, {
      onDelete: "set null",
    })
    .notNull(),
  subject: varchar("subject"),
  content: varchar("content"),
  type: notificationTypeEnum("type").notNull().default("info"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  updatedAt: timestamp("updated_at", {
    precision: 6,
    withTimezone: true,
  }).default(sql`now()`),
  deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
});

export const userNotifications = pgTable(
  "user_notifications",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    notificationId: uuid("notification_id")
      .references(() => notifications.id, {
        onDelete: "cascade",
      })
      .notNull(),
    viewed: boolean("viewed").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    }).default(sql`now()`),
    updatedAt: timestamp("updated_at", {
      precision: 6,
      withTimezone: true,
    }).default(sql`now()`),
    deletedAt: timestamp("deleted_at", { precision: 6, withTimezone: true }),
  },
  (table) => ({
    unique: unique().on(table.userId, table.notificationId),
  })
);

export const userNotificationsRelations = relations(
  userNotifications,
  ({ one }) => ({
    user: one(users, {
      fields: [userNotifications.userId],
      references: [users.id],
    }),
    notification: one(notifications, {
      fields: [userNotifications.notificationId],
      references: [notifications.id],
    }),
  })
);

export const notificationsRelations = relations(
  notifications,
  ({ one, many }) => ({
    fromUser: one(users, {
      fields: [notifications.fromUserId],
      references: [users.id],
    }),
    userNotifications: many(userNotifications),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  validator: one(validators, {
    fields: [subscriptions.validatorId],
    references: [validators.id],
  }),
  endpoint: one(endpoints, {
    fields: [subscriptions.endpointId],
    references: [endpoints.id],
  }),
  subnet: one(subnets, {
    fields: [subscriptions.subnetId],
    references: [subnets.id],
  }),
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [subscriptions.serviceId],
    references: [services.id],
  }),
}));

export const userSubscriptionRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));
