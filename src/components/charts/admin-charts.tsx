"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminStats } from "@/types/api";

const COLORS = ["var(--chart-1)", "var(--chart-3)", "var(--chart-5)"];

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  );
}

export function PieBlock({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BarBlock({
  title,
  data,
  color = "var(--chart-3)",
}: {
  title: string;
  data: { name: string; value: number }[];
  color?: string;
}) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function UsersPie({ stats }: { stats: AdminStats }) {
  return (
    <PieBlock
      title="Users by role"
      data={[
        { name: "Candidates", value: stats.users.candidates },
        { name: "Companies", value: stats.users.companies },
        { name: "Admins", value: stats.users.admins },
      ]}
    />
  );
}

export function AssessmentsBar({ stats }: { stats: AdminStats }) {
  return (
    <BarBlock
      title="Assessments by status"
      data={[
        { name: "Draft", value: stats.assessments.draft },
        { name: "Published", value: stats.assessments.published },
        { name: "Closed", value: stats.assessments.closed },
      ]}
    />
  );
}

export function AttemptsBar({ stats }: { stats: AdminStats }) {
  return (
    <BarBlock
      title="Attempts by status"
      color="var(--chart-1)"
      data={[
        { name: "In progress", value: stats.attempts.inProgress },
        { name: "Submitted", value: stats.attempts.submitted },
        { name: "Evaluated", value: stats.attempts.evaluated },
      ]}
    />
  );
}
