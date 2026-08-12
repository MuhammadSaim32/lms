"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  YAxis,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import authApi from "../../../api/AuthApi";
import routes from "../../../routes";
import PeopleIcon from "@mui/icons-material/People";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-semibold text-slate-300 mb-1">{`Month: ${label}`}</p>
        <p className="text-cyan-400 font-bold">{`Users: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function UserAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await authApi.getUsersAnalytics(routes.getUsersAnalytics);
        const rawData = response.months || response || [];
        if (Array.isArray(rawData)) {
          const formatted = rawData.map((item: any) => ({
            ...item,
            name: item.name ? String(item.name).slice(0, 3) : item.month || "",
            count: Number(item.count || 0),
          }));
          setData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch user analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const ChartBody = (
    <div className="w-full h-[320px] sm:h-[360px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
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
          <Bar
            dataKey="count"
            fill="url(#userBarGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <PeopleIcon className="text-cyan-400" />
              User Registration Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Monitor monthly student acquisitions and platform registration growth.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium">Loading user analytics...</span>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No user analytics data available.
            </div>
          ) : (
            ChartBody
          )}
        </div>
      </div>
    </div>
  );
}