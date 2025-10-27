import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const inventoryStatusEnum = pgEnum('inventory_status', [
  'INSTOCK',
  'LOWSTOCK',
  'OUTOFSTOCK',
]);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  image: text('image'),
  categorie: varchar('categorie', { length: 100 }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  reference: varchar('reference', { length: 100 }),
  shellid: integer('shellid'),
  inventoryStatus: inventoryStatusEnum('inventory_status').default('INSTOCK'),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const wishlists = pgTable(
  'wishlists',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueUserProduct: uniqueIndex('unique_user_product').on(
      table.userId,
      table.productId
    ),
  })
);
