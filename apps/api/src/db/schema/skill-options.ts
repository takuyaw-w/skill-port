import { boolean, index, integer, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { appSchema } from "./app-schema.js";

export const skillOptions = appSchema.table(
  "skill_options",
  {
    id: uuid("id").primaryKey(),

    category: text("category").notNull(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),

    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_options_category_idx").on(table.category),
    index("skill_options_normalized_name_idx").on(table.normalizedName),
    index("skill_options_is_active_idx").on(table.isActive),
    index("skill_options_category_sort_order_idx").on(table.category, table.sortOrder),
    uniqueIndex("skill_options_category_normalized_name_unique").on(
      table.category,
      table.normalizedName,
    ),
  ],
);

export const skillOptionAliases = appSchema.table(
  "skill_option_aliases",
  {
    id: uuid("id").primaryKey(),

    skillOptionId: uuid("skill_option_id")
      .notNull()
      .references(() => skillOptions.id, { onDelete: "cascade" }),

    aliasName: text("alias_name").notNull(),
    aliasNormalizedName: text("alias_normalized_name").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_option_aliases_skill_option_id_idx").on(table.skillOptionId),
    index("skill_option_aliases_alias_normalized_name_idx").on(table.aliasNormalizedName),
    uniqueIndex("skill_option_aliases_option_alias_unique").on(
      table.skillOptionId,
      table.aliasNormalizedName,
    ),
  ],
);
