"use client";

import OrderAnalytics from "../admin/order-analytics/page";
import UserAnalytics from "../admin/user-analytics/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Dashboard() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 text-slate-100 space-y-8">
      {/* Dashboard Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Admin Analytics
            </h1>
            <Badge variant="default" className="bg-indigo-600/90 text-white font-medium text-xs px-2.5 py-0.5">
              Live Systems
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time platform insights, order trends, and user registration analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs py-1.5 px-3 border-slate-700 bg-slate-900/80 text-slate-300 gap-1.5 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Status: Optimal
          </Badge>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshIcon style={{ fontSize: 16 }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Analytics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Analytics Card */}
        <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700/80 transition-all shadow-2xl backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <BarChartIcon className="text-indigo-400" style={{ fontSize: 22 }} />
                Orders Analytics
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Monthly sales volume and order trend over time
              </CardDescription>
            </div>
            <Badge variant="blue">Sales Trend</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <OrderAnalytics />
          </CardContent>
        </Card>

        {/* User Analytics Card */}
        <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700/80 transition-all shadow-2xl backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <TrendingUpIcon className="text-cyan-400" style={{ fontSize: 22 }} />
                User Acquisition
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Monthly new user registrations and growth metrics
              </CardDescription>
            </div>
            <Badge variant="success">User Base</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <UserAnalytics />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}