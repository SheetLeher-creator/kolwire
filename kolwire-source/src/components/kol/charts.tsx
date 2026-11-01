import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Post } from "@/data/types";
import { monthlyTrend, sentimentPie, SENTIMENT_VAR } from "@/lib/intel";

const tip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--foreground)" } };
const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false };

export function SentimentDonut({ posts, height = 220 }: { posts: Post[]; height?: number }) {
  const data = sentimentPie(posts).filter((d) => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="none">
          {data.map((d) => <Cell key={d.key} fill={d.fill} />)}
        </Pie>
        <Tooltip {...tip} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SentimentTrend({ posts, height = 240 }: { posts: Post[]; height?: number }) {
  const data = monthlyTrend(posts);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" {...axis} /><YAxis allowDecimals={false} {...axis} width={24} />
        <Tooltip {...tip} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {(["positive", "neutral", "mixed", "negative"] as const).map((s) => (
          <Area key={s} type="monotone" dataKey={s} stackId="1" stroke={SENTIMENT_VAR[s]} fill={SENTIMENT_VAR[s]} fillOpacity={0.35} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HBar({ data, height = 240, color = "var(--electric)" }: { data: { name: string; value: number }[]; height?: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid stroke="var(--border)" horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...axis} />
        <YAxis type="category" dataKey="name" width={130} {...axis} />
        <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StackedSentimentBar({ data, height = 280 }: { data: Record<string, number | string>[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" {...axis} interval={0} angle={-20} textAnchor="end" height={60} />
        <YAxis allowDecimals={false} {...axis} width={24} />
        <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {(["positive", "neutral", "mixed", "negative"] as const).map((s) => <Bar key={s} dataKey={s} stackId="a" fill={SENTIMENT_VAR[s]} />)}
      </BarChart>
    </ResponsiveContainer>
  );
}
