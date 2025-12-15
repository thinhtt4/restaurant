import { useState } from "react";
import {
  useGetInvoiceStatusQuery,
  useGetRevenueQuery,
  useGetStatQuery,
  type RevenueItem
} from "@/store/api/statisticalApi";

export function useDashboardStats() {
  const now = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

  // Revenue 
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number | null>(null);

  // Tính startDate / endDate
  let startDate = "";
  let endDate = "";

  if (month) {
    startDate = formatDate(new Date(year, month - 1, 1));
    endDate = formatDate(new Date(year, month, 0));
  } else {
    startDate = formatDate(new Date(year, 0, 1));
    endDate = formatDate(new Date(year, 11, 31));
  }

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError
  } = useGetRevenueQuery({ startDate, endDate });

  // Chart data
  let chartData: RevenueItem[] = [];

  if (revenueData?.data) {
    if (!month) {
      chartData = Array.from({ length: 12 }, (_, i) => {
        const monthStart = new Date(year, i, 1);
        const monthEnd = new Date(year, i + 1, 0);

        const monthRevenue = revenueData.data
          .filter(d => {
            const dDate = new Date(d.date);
            return dDate >= monthStart && dDate <= monthEnd;
          })
          .reduce(
            (acc, cur) => ({
              revenue: acc.revenue + cur.revenue,
              orderCount: acc.orderCount + cur.orderCount
            }),
            { revenue: 0, orderCount: 0 }
          );

        return {
          label: String(i + 1),
          revenue: monthRevenue.revenue,
          orderCount: monthRevenue.orderCount
        };
      });
    } else {
      const daysInMonth = new Date(year, month, 0).getDate();

      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = formatDate(new Date(year, month - 1, day));
        const item = revenueData.data.find(d => d.date === dateStr);

        return {
          label: String(day).padStart(2, "0"),
          revenue: item?.revenue ?? 0,
          orderCount: item?.orderCount ?? 0
        };
      });
    }
  }

  const totalRevenue = chartData.reduce((s, i) => s + i.revenue, 0);
  const totalOrders = chartData.reduce((s, i) => s + i.orderCount, 0);

  // Invoice 
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState("year");

  const getQuarterRange = (year: number, quarter: string) => {
    switch (quarter) {
      case "q1":
        return { startInvoice: `${year}-01-01`, endInvoice: `${year}-03-31` };
      case "q2":
        return { startInvoice: `${year}-04-01`, endInvoice: `${year}-06-30` };
      case "q3":
        return { startInvoice: `${year}-07-01`, endInvoice: `${year}-09-30` };
      case "q4":
        return { startInvoice: `${year}-10-01`, endInvoice: `${year}-12-31` };
      default:
        return { startInvoice: `${year}-01-01`, endInvoice: `${year}-12-31` };
    }
  };

  const { startInvoice, endInvoice } = getQuarterRange(
    selectedYear,
    selectedQuarter
  );

  const { data: invoiceData, isLoading: invoiceLoading } =
    useGetInvoiceStatusQuery({
      startDate: startInvoice,
      endDate: endInvoice
    });

  // Stats 
  const {
    data: statData,
    isLoading: statLoading,
    error: statError
  } = useGetStatQuery();

  return {
    // revenue
    year,
    month,
    setYear,
    setMonth,
    chartData,
    totalRevenue,
    totalOrders,
    revenueLoading,
    revenueError,
    startDate,
    endDate,
    now,

    // invoice
    selectedYear,
    selectedQuarter,
    setSelectedYear,
    setSelectedQuarter,
    invoiceData,
    invoiceLoading,

    // stat cards
    statData,
    statLoading,
    statError
  };
}
