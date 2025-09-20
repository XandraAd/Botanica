getAddresses: builder.query({
  query: () => `/addresses`,
  providesTags: ["User"],
}),
addAddress: builder.mutation({
  query: (data) => ({
    url: `/addresses`,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["User"],
}),
updateAddress: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/addresses/${id}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["User"],
}),
deleteAddress: builder.mutation({
  query: (id) => ({
    url: `/addresses/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["User"],
}),
