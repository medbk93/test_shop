import {
  and,
  asc,
  eq,
  getTableColumns,
  ilike,
  gte,
  lte,
  count,
} from 'drizzle-orm';
import { db } from '../config/db.js';
import { products, wishlists } from '../db/schema.js';

const buildFilterConditions = (filters) => {
  const conditions = [];
  const INVENTORY_STATUS = ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'];

  if (filters.name) {
    conditions.push(ilike(products.name, `%${filters.name}%`));
  }

  if (filters.categorie) {
    conditions.push(eq(products.categorie, filters.categorie));
  }

  if (
    filters.inventoryStatus &&
    INVENTORY_STATUS.includes(filters.inventoryStatus)
  ) {
    conditions.push(eq(products.inventoryStatus, filters.inventoryStatus));
  }

  if (filters.rating) {
    conditions.push(eq(products.rating, filters.rating));
  }

  if (filters.price) {
    if (filters.price.min !== undefined) {
      conditions.push(gte(products.price, filters.price.min));
    }
    if (filters.price.max !== undefined) {
      conditions.push(lte(products.price, filters.price.max));
    }
  }

  return conditions;
};

const selectedColumns = (selectFields) => {
  const allColumns = getTableColumns(products);
  let selectedColumns = {};
  if (selectFields.length > 0) {
    for (const field of selectFields) {
      if (allColumns[field]) selectedColumns[field] = allColumns[field];
    }
  }
  // fallback to all columns if nothing valid requested
  if (Object.keys(selectedColumns).length === 0) selectedColumns = allColumns;
  return selectedColumns;
};

export const getTotalProducts = async (filters = {}) => {
  const conditions = buildFilterConditions(filters);

  const countFilteredProductsQuery = db
    .select({ count: count() })
    .from(products);

  if (conditions.length > 0) {
    countFilteredProductsQuery.where(and(...conditions));
  }

  const [totalProducts] = await countFilteredProductsQuery;

  return totalProducts.count;
};

export const findProducts = async (
  pageSize = 5,
  page = 1,
  filters = {},
  selectFields
) => {
  const conditions = buildFilterConditions(filters);
  const fieldsToSelect = selectedColumns(selectFields);

  const query = db
    .select({ ...fieldsToSelect, wishlistId: wishlists.id })
    .from(products)
    .leftJoin(wishlists, eq(products.id, wishlists.productId));
  // Apply filters if any
  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const filteredProducts = await query
    .orderBy(asc(products.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return filteredProducts;
};

export const getProductById = async (id) => {
  const product = await db.select().from(products).where(eq(products.id, id));
  return product;
};

export const createProduct = async (productToAdd) => {
  const product = await db.insert(products).values(productToAdd).returning();
  return product;
};

export const updateProduct = async (id, updatedFields) => {
  const updatedProduct = await db
    .update(products)
    .set(updatedFields)
    .where(eq(products.id, id))
    .returning();
  return updatedProduct;
};

export const deleteProduct = async (id) => {
  await db.delete(products).where(eq(products.id, id));
};

export const insertToWishlist = async (userId, productId) => {
  return await db.insert(wishlists).values({ productId, userId }).returning();
};

export const removeFromWishlist = async (userId, productId) => {
  const filters = [
    eq(wishlists.userId, userId),
    eq(wishlists.productId, productId),
  ];
  await db.delete(wishlists).where(and(...filters));
};
