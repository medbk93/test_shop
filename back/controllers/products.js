import asyncHandler from '../middleware/asyncHandler.js';
import {
  addProductToWishlist,
  fetchProductById,
  fetchProducts,
  insertProduct,
  modifyProduct,
  removeProduct,
  removeProductFromWishlist,
} from '../services/product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = +process.env.PAGINATION_LIMIT || 10;

  // Extract filter parameters from query
  const filters = {};
  const allowedFilters = [
    'name',
    'categorie',
    'price',
    'inventoryStatus',
    'rating',
  ];

  for (const key of allowedFilters) {
    if (req.query[key]) {
      filters[key] = req.query[key];
    }
  }

  // Handle price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filters.price = {
      min: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      max: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
    };
  }

  // Optional select fields (comma-separated), e.g. ?select=name,price
  const selectParam = req.query.select;
  let selectFields = [];
  if (selectParam) {
    selectFields = selectParam
      .toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const { products, totalCount, totalPages } = await fetchProducts(
    page,
    filters,
    selectFields
  );

  res.json({
    products,
    page: Number(page),
    totalPages: totalPages,
    totalProducts: totalCount,
    pageSize: pageSize,
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    image,
    categorie,
    price,
    quantity,
    reference,
    shellid,
    inventoryStatus,
    rating,
  } = req.body;
  const product = {
    code,
    name,
    description,
    image,
    categorie,
    price,
    quantity,
    reference,
    shellid,
    inventoryStatus,
    rating,
  };

  //validate input data
  if (!code || !name || !quantity || !price) {
    res.status(400);
    throw new Error('Some fields are missing');
  }
  if (isNaN(price) || isNaN(quantity)) {
    res.status(400);
    throw new Error('Price and quantity must be numbers');
  }
  const createdProduct = await insertProduct(product);
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    image,
    categorie,
    price,
    quantity,
    reference,
    shellid,
    inventoryStatus,
    rating,
  } = req.body;

  //validate input data
  if ((price && isNaN(price)) || (quantity && isNaN(quantity))) {
    res.status(400);
    throw new Error('Price and quantity must be numbers');
  }
  const productResearch = await fetchProductById(req.params.id);

  if (productResearch.length) {
    const product = productResearch[0];
    product.code = code;
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.categorie = categorie;
    product.price = price;
    product.quantity = quantity;
    product.reference = reference;
    product.shellid = shellid;
    product.inventoryStatus = inventoryStatus;
    product.rating = rating;

    const updatedProduct = await modifyProduct(req.params.id, product);
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await fetchProductById(req.params.id);

  if (product.length) {
    await removeProduct(product[0].id);
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Add a product to wishlist
// @route   POST /api/products/wishlist
// @access  Private/User
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const product = await fetchProductById(productId);
  if (!product.length) {
    res.status(404);
    throw new Error('Product not found');
  }
  const [addedWishlist] = await addProductToWishlist(userId, product[0].id);
  res.status(200).json({
    message: 'Product added to wishlist',
    userId: addedWishlist.userId,
    productId: addedWishlist.productId,
  });
});

// @desc    Remove a product from wishlist
// @route   DELETE /api/products/wishlist/:id
// @access  Private/User
const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const product = await fetchProductById(productId);
  if (!product.length) {
    res.status(404);
    throw new Error('Product not found');
  }
  await removeProductFromWishlist(userId, product[0].id);
  res.status(200).json({ message: 'Product removed from wishlist' });
});

export {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
};
