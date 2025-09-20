import { apiSlice } from "./apiSlice";
import { COLLECTION_URL, BASE_URL } from "../store/constants";

export const collectionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCollection: builder.mutation({
      query: (newCollection) => ({
        url: COLLECTION_URL,
        method: "POST",
        body: newCollection,
      }),
      invalidatesTags: ["Collections"],
    }),

    updateCollection: builder.mutation({
      query: ({ collectionId, updatedCollection }) => ({
        url: `${COLLECTION_URL}/${collectionId}`,
        method: "PUT",
        body: updatedCollection,
      }),
      invalidatesTags: ["Collections"],
    }),

    deleteCollection: builder.mutation({
      query: (collectionId) => ({
        url: `${COLLECTION_URL}/${collectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collections"],
    }),

    fetchCollections: builder.query({
      query: () => COLLECTION_URL,
      providesTags: ["Collections"],
 transformResponse: (response) =>
  response.map((c) => ({
    _id: c._id,
    name: c.name || "Untitled Collection",
    previewImage: c.previewImage || null, // use backend field
    productsCount: c.count ?? c.products?.length ?? 0,
  })),


    }),
  }),
});

export const {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useFetchCollectionsQuery,
} = collectionSlice;
