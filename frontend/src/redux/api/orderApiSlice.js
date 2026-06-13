import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL, UPLOAD_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    createManualOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}/manual`,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    uploadPaymentProof: builder.mutation({
      query: ({ orderId, paymentProof }) => ({
        url: `${ORDERS_URL}/${orderId}/pay-proof`,
        method: "PUT",
        body: { paymentProof },
      }),
    }),

    approvePaymentProof: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-approve`,
        method: "PUT",
      }),
    }),

    rejectPaymentProof: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-reject`,
        method: "PUT",
      }),
    }),

    appealPaymentProof: builder.mutation({
      query: ({ orderId, appealText }) => ({
        url: `${ORDERS_URL}/${orderId}/pay-appeal`,
        method: "PUT",
        body: { appealText },
      }),
    }),

    uploadPaymentProofFile: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}/proof`,
        method: "POST",
        body: formData,
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateOrderMutation,
  useCreateManualOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useUploadPaymentProofMutation,
  useApprovePaymentProofMutation,
  useRejectPaymentProofMutation,
  useAppealPaymentProofMutation,
  useUploadPaymentProofFileMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
