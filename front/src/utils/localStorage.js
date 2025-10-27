function getDataElement(STORAGE_CART_KEY) {
  const raw = localStorage.getItem(STORAGE_CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveDataElement(STORAGE_CART_KEY, productDataElement) {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(productDataElement));
}

export function addToDataElement(STORAGE_CART_KEY, item) {
  const cart = getDataElement(STORAGE_CART_KEY);
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveDataElement(STORAGE_CART_KEY, cart);
}

export function removeFromDataElement(STORAGE_CART_KEY, id) {
  const cart = getDataElement(STORAGE_CART_KEY).filter(
    (item) => item.id !== id
  );
  saveDataElement(STORAGE_CART_KEY, cart);
}

export function updateQuantity(STORAGE_CART_KEY, id, quantity) {
  const cart = getDataElement(STORAGE_CART_KEY).map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  saveDataElement(STORAGE_CART_KEY, cart);
}

export function clearDataElement(STORAGE_CART_KEY) {
  localStorage.removeItem(STORAGE_CART_KEY);
}

export function getDataElementItems(STORAGE_CART_KEY) {
  return getDataElement(STORAGE_CART_KEY);
}

export function getDataElementTotal(STORAGE_CART_KEY) {
  return getDataElement(STORAGE_CART_KEY).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}
export function getDataElementItemById(STORAGE_CART_KEY, id) {
  return getDataElement(STORAGE_CART_KEY).find((item) => item.id === id);
}
