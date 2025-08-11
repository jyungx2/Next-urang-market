// /zustand/selectedProductStore.js
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const SelectedProductStore = (set) => ({
  product: null,
  setProduct: (product) => set({ product }),
  resetProduct: () => set({ product: null }),
});

const useSelectedProductStore = create(
  persist(SelectedProductStore, {
    name: "selectedProduct",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useSelectedProductStore;
