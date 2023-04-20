import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5800",
  }),
  tagTypes: ["skill"],

  endpoints: (builder) => ({
    getAlldata: builder.query({
      query: () => "/skills",
      providesTags: ["skill"],
    }),
    

 

  // for multiple
    deletedata: builder.mutation({
      query: (ids) => {
        return {
          url: "/skills",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        };
      },
      invalidatesTags: ["skill"],
    }),
    
    

   
  }),
});

export const { useGetAlldataQuery,useDeletedataMutation } = apiSlice;
