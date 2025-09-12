import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../store/constants";

// CATEGORY_URL should be "/api/category"
export const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: CATEGORY_URL, // POST /api/category
        method: "POST",
        body: newCategory,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`, // PUT /api/category/:id
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`, // DELETE /api/category/:id
        method: "DELETE",
      }),
    }),

    fetchCategories: builder.query({
       query: () => `${CATEGORY_URL}/categories`, // GET /api/category
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categorySlice;
