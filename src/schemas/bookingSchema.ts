import { z } from "zod";

export const bookingTable = z
  .object({
    orderName: z.string().min(1, "Họ và tên không được trống"),

    // email: z
    //   .string()
    //   // .min(1, "Email không được bỏ trống")
    //   .email("Email không hợp lệ"),

    phone: z
      .string()
      .min(9, "Số điện thoại quá ngắn")
      .max(15, "Số điện thoại quá dài")
      .regex(/^[0-9]+$/, "SĐT chỉ chứa số"),

  //   date: z
  //     .string()
  //     .min(1, "Vui lòng chọn ngày đặt bàn")
  //     .refine(
  //       (value) => {
  //         const selected = new Date(value);
  //         const today = new Date();
  //         today.setHours(0, 0, 0, 0); // bỏ giờ phút giây
  //         return selected >= today;
  //       },
  //       {
  //         message: "Không được chọn ngày trong quá khứ",
  //       }
  //     ),

  //   time: z.string(), // HH:mm
  // })
  // .superRefine((data, ctx) => {
  //   const { date, time } = data;

  //   const [hour, minute] = time.split(":").map(Number);
  //   const totalMinutes = hour * 60 + minute;

  //   const minMinutes = 6 * 60; // 06:00
  //   const maxMinutes = 23 * 60; // 21:00

  //   if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
  //     ctx.addIssue({
  //       path: ["time"],
  //       code: z.ZodIssueCode.custom,
  //       message: "Thời gian phải từ 06:00 đến 21:00",
  //     });
  //   }

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const selectedDate = new Date(date);
  //   if (selectedDate < today) {
  //     ctx.addIssue({
  //       path: ["date"],
  //       code: z.ZodIssueCode.custom,
  //       message: "Ngày không được nhỏ hơn hôm nay",
  //     });
  //     return; // dừng, vì không cần check giờ tiếp
  //   }

  //   //
  //   // Nếu chọn NGÀY HÔM NAY → giờ phải lớn hơn hoặc bằng giờ hiện tại
  //   //
  //   const isToday =
  //     selectedDate.getFullYear() === today.getFullYear() &&
  //     selectedDate.getMonth() === today.getMonth() &&
  //     selectedDate.getDate() === today.getDate();

  //   if (isToday) {
  //     const now = new Date();
  //     const nowMinutes = now.getHours() * 60 + now.getMinutes();

  //     if (totalMinutes < nowMinutes) {
  //       ctx.addIssue({
  //         path: ["time"],
  //         code: z.ZodIssueCode.custom,
  //         message: "Thời gian phải lớn hơn thời điểm hiện tại",
  //       });
  //     }
  //   }
  });

export type BookingTable = z.infer<typeof bookingTable>;

export const bookingChangeTable = z.object({
  date: z
    .string()
    .min(1, "Vui lòng chọn ngày đặt bàn")
    .refine(
      (value) => {
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // bỏ giờ phút giây
        return selected >= today;
      },
      {
        message: "Không được chọn ngày trong quá khứ",
      }
    ),
});

export type BookingTableChange = z.infer<typeof bookingChangeTable>;
