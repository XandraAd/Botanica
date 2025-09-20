import { apiSlice } from "./apiSlice";
import { USERS_URL} from "../store/constants";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"], // Added to invalidate cache after update
    }),

    // ✅ Fetch current user profile
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ["User"],
    }),

    // ✅ Addresses
   getAddresses: builder.query({
  query: () => ({
    url: "/addresses",
  }),
  providesTags: ["Address"],
}),
addAddress: builder.mutation({
  query: (data) => ({
    url: "/addresses",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Address"],
}),
updateAddress: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/addresses/${id}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Address"],
}),
deleteAddress: builder.mutation({
  query: (id) => ({
    url: `/addresses/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Address"],
}),


    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
      keepUnusedDataFor: 5,
    }),
    
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }], // Added to invalidate users list
    }),
    
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
      keepUnusedDataFor: 5,
    }),
    
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,      // update profile
  useGetProfileQuery,      // fetch profile
  useGetAddressesQuery,    // fetch addresses
  useAddAddressMutation,   // add
  useUpdateAddressMutation,// update
  useDeleteAddressMutation,// delete
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = userSlice;