import {
  findProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  insertToWishlist,
  removeFromWishlist,
  getTotalProducts,
} from '../data_access/product.js';

export const fetchProducts = async (pageNumber, filters = {}, selectFields) => {
  const page = Number(pageNumber) || 1;
  const limit = +process.env.PAGINATION_LIMIT || 10;

  const [products, totalCount] = await Promise.all([
    findProducts(limit, page, filters, selectFields),
    getTotalProducts(filters)
  ]);

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / limit)
  };
};

export const insertProduct = async (productToAdd) => {
  const product = await createProduct(productToAdd);
  return product;
};

export const modifyProduct = async (id, updatedFields) => {
  const updatedProduct = await updateProduct(id, updatedFields);
  return updatedProduct;
};

export const removeProduct = async (id) => {
  await deleteProduct(id);
};

export const fetchProductById = async (id) => {
  const product = await getProductById(id);
  return product;
};

export const addProductToWishlist = async (userId, productId) => {
  const wishlist = await insertToWishlist(userId, productId);
  return wishlist;
};

export const removeProductFromWishlist = async (userId, productId) => {
  await removeFromWishlist(userId, productId);
};
