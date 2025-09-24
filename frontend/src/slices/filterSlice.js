import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  availability: [],
  priceRange: [0, 200],
  brands: [],
  colors: [],
  sizes: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategories: (state, action) => { state.categories = action.payload; },
    setAvailability: (state, action) => { state.availability = action.payload; },
    setPriceRange: (state, action) => { state.priceRange = action.payload; },
    setBrands: (state, action) => { state.brands = action.payload; },
    setColors: (state, action) => { state.colors = action.payload; },
    setSizes: (state, action) => { state.sizes = action.payload; },
    resetFilters: () => initialState,
  },
});

export const {
  setCategories, setAvailability, setPriceRange,
  setBrands, setColors, setSizes, resetFilters
} = filtersSlice.actions;

export default filtersSlic.reducer;
