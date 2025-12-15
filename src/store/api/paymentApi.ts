import { baseApi } from "./baseApi";

export interface MomoResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paymentVnpay: builder.mutation<string, { orderId: string; amount: number }>(
      {
        query: ({ orderId, amount }) => ({
          url: `/vn_pay/pay?orderId=${orderId}&amount=${amount}`,
          method: "POST",
          responseHandler: (response) => response.text(),
        }),
        invalidatesTags: (result, _error, { orderId }) =>
          result
            ? [
                { type: "ORDER", id: orderId },
                { type: "ORDER", id: "LIST" },
              ]
            : [],
      }
    ),

    momoPayment: builder.mutation<
      MomoResponse,
      { orderId: string; amount: number }
    >({
      query: ({ orderId, amount }) => ({
        url: `/api/momo/create?orderId=${orderId}&amount=${amount}`,
        method: "POST",
      }),
    }),

    cashPayment: builder.mutation<boolean, { orderId: string }>({
      query: ({ orderId }) => ({
        url: `/order-checkout/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: (result, _error, { orderId }) =>
        result
          ? [
              { type: "ORDER", id: orderId },
              { type: "ORDER", id: "LIST" },
            ]
          : [],
    }),
  }),
});

export const {
  usePaymentVnpayMutation,
  useCashPaymentMutation,
  useMomoPaymentMutation,
} = paymentApi;
