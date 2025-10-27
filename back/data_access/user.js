import { eq } from 'drizzle-orm';

import { db } from '../config/db.js';
import { users } from '../db/schema.js';

export const getUserByEmail = async (email) => {
  const user = await db.select().from(users).where(eq(users.email, email));

  return user.length ? user[0] : null;
};

export const createUser = async (user) => {
  const createdUser = await db.insert(users).values(user).returning();

  return createdUser;
};

export const getUserByField = async (field, value) => {
  if (!users[field]) {
    throw new Error(`Champ "${field}" non reconnu dans le schéma users`);
  }
  const user = await db.select().from(users).where(eq(users[field], value));

  return user.length ? user[0] : null;
};
