// /zustand/selectedProductStore.js
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const SelectedProductStore = (set) => ({
  selectedProduct: null,
  setProduct: (product) => set({ selectedProduct: product }),
  resetProduct: () => set({ selectedProduct: null }),
});

const useSelectedProductStore = create(
  persist(SelectedProductStore, {
    name: "selectedProduct",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useSelectedProductStore;
