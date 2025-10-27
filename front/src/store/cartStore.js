import { create } from 'zustand';
import {
  addToDataElement,
  removeFromDataElement,
  updateQuantity,
  clearDataElement,
  getDataElementItems,
} from '@/utils/localStorage';
import { STORAGE_CART_KEY } from '@/utils/constants';

export const useCartStore = create((set, get) => ({
  items: getDataElementItems(STORAGE_CART_KEY),

  add: (item) => {
    const items = get().items;
    const existing = items.find((i) => i.id === item.id);
    const updatedItems = existing
      ? items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      : [...items, item];
    set({ items: updatedItems });
    addToDataElement(STORAGE_CART_KEY, item); //refresh local storage
  },

  remove: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
    removeFromDataElement(STORAGE_CART_KEY, id); //refresh local storage
  },

  update: (id, quantity) => {
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    });
    updateQuantity(STORAGE_CART_KEY, id, quantity); //refresh local storage
  },

  clear: () => {
    set({ items: [] });
    clearDataElement(STORAGE_CART_KEY); //refresh local storage
  },

  getItem: (id) => get().items.find((i) => i.id === id),

  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getCountItems: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),
}));
