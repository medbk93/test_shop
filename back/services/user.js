import {
  getUserByEmail,
  createUser,
  getUserByField,
} from '../data_access/user.js';

export const getUser = async (email) => {
  const user = await getUserByEmail(email);

  return user;
};

export const getUserBy = async (field, value) => {
  const user = await getUserByField(field, value);

  return user;
};

export const registerUser = async (user) => {
  return await createUser(user);
};
