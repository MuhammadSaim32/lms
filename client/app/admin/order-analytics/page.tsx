"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import orderApi from "../../../api/OrderApi";
import routes from "../../../routes";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-semibold text-slate-300 mb-1">{`Month: ${label}`}</p>
        <p className="text-indigo-400 font-bold">{`Orders: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function OrderAnalytics() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const resp = await orderApi.getOrdersAnalytics(
          routes.getOrdersAnalytics
        );
        const months = resp?.months;
        if (Array.isArray(months)) {
          const mapped = months.map((m: any) => ({
            name: String(m.name).slice(0, 3),
            uv: Number(m.count || 0),
          }));
          setChartData(mapped);
        } else if (Array.isArray(resp)) {
          const mapped = resp.map((m: any) => ({
            name: String(m.name || m.month || "").slice(0, 3),
            uv: Number(m.count || 0),
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.error("order analytics fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const ChartBody = (
    <div className="w-full h-[320px] sm:h-[360px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#orderGradient)"
            dot={{ r: 4, fill: '#6366f1' }}
            activeDot={{ r: 6, fill: '#818cf8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <ShoppingCartIcon className="text-indigo-400" />
              Order Sales Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Track course purchasing trends and monthly sales volume metrics.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium">Loading sales analytics...</span>
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No order analytics data available.
            </div>
          ) : (
            ChartBody
          )}
        </div>
      </div>
    </div>
  );
}

