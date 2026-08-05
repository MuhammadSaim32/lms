"use client";
import { useEffect, useState } from "react";
import { Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts";
import orderApi from "../../../api/OrderApi";
import routes from "../../../routes";
import Loading from "../../../components/Loading";

const TinyAreaChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const resp = await orderApi.getOrdersAnalytics(
          routes.getOrdersAnalytics,
        );
        const months = resp?.months;
        if (Array.isArray(months)) {
          const mapped = months.map((m: any) => ({
            name: String(m.name).slice(0, 3),
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

  if (loading) {
    return <Loading size={60} />;
  }

  return (
    <div className="flex   w-full justify-center items-center">
      <AreaChart
        style={{
          width: "100%",
          maxWidth: "1000px",
          maxHeight: "500px",
          aspectRatio: 1.618,
        }}
        responsive
        data={chartData}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <YAxis
          domain={[0, 8]} /* Enforces Y min of 0 and Y max of 1000 */
          hide={false} /* Keeps layout tiny by hiding labels and lines */
        />
        <XAxis
          domain={[0, 8]} /* Enforces Y min of 0 and Y max of 1000 */
          hide={false} /* Keeps layout tiny by hiding labels and lines */
        />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </div>
  );
};

export default TinyAreaChart;
