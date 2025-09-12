import { apiSlice } from "./apiSlice";
import { COLLECTION_URL } from "../store/constants";

export const collectionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCollection: builder.mutation({
      query: (newCollection) => ({
        url: COLLECTION_URL, // ✅ /api/collections
        method: "POST",
        body: newCollection,
      }),
      invalidatesTags: ["Collections"],
    }),

    updateCollection: builder.mutation({
      query: ({ collectionId, updatedCollection }) => ({
        url: `${COLLECTION_URL}/${collectionId}`, // ✅ /api/collections/:id
        method: "PUT",
        body: updatedCollection,
      }),
      invalidatesTags: ["Collections"],
    }),

    deleteCollection: builder.mutation({
      query: (collectionId) => ({
        url: `${COLLECTION_URL}/${collectionId}`, // ✅ /api/collections/:id
        method: "DELETE",
      }),
      invalidatesTags: ["Collections"],
    }),

    fetchCollections: builder.query({
      query: () => COLLECTION_URL, // ✅ /api/collections
      providesTags: ["Collections"],
    }),
  }),
});

export const {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useFetchCollectionsQuery,
} = collectionSlice;
