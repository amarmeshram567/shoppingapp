import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Surface, formatMoney } from "./AdminUi";

const chartStyles = {
  stroke: "hsl(var(--border))",
  tick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 }
};

export const RevenueChart = ({ data }) => (
  <Surface className="p-5">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">Revenue analytics</h3>
        <p className="text-sm text-slate-400">Revenue vs target over the last six months</p>
      </div>
    </div>
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.stroke} vertical={false} />
          <XAxis dataKey="month" stroke={chartStyles.tick.fill} tick={chartStyles.tick} />
          <YAxis stroke={chartStyles.tick.fill} tick={chartStyles.tick} tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, color: "hsl(var(--foreground))" }} formatter={(value) => formatMoney(value)} />
          <Line type="monotone" dataKey="target" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Surface>
);

export const SalesChart = ({ data }) => (
  <Surface className="p-5">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">Sales by category</h3>
      <p className="text-sm text-slate-400">Units sold across top departments</p>
    </div>
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.stroke} vertical={false} />
          <XAxis dataKey="label" stroke={chartStyles.tick.fill} tick={chartStyles.tick} />
          <YAxis stroke={chartStyles.tick.fill} tick={chartStyles.tick} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, color: "hsl(var(--foreground))" }} />
          <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Surface>
);
