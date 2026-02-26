"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface OverviewProps {
    data: { name: string; total: number }[];
    type?: 'bar' | 'line' | 'pie';
    color?: string;
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export function Overview({ data, type = 'bar', color = 'hsl(var(--primary))' }: OverviewProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-full min-h-[200px] items-center justify-center text-muted-foreground border border-dashed rounded-lg italic">
                No data available
            </div>
        );
    }

    if (type === 'pie') {
        const total = data.reduce((acc, curr) => acc + curr.total, 0);
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="total"
                        animationBegin={0}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" dy="-0.5em" className="fill-emerald-950 font-black text-2xl">
                            {Math.floor(total).toLocaleString()}
                        </tspan>
                        <tspan x="50%" dy="1.5em" className="fill-emerald-600 font-bold text-xs uppercase tracking-widest">
                            Total
                        </tspan>
                    </text>
                </PieChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#064e3b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        hide
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(5, 150, 105, 0.1)' }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#fff',
                        }}
                    />
                    <Bar dataKey="total" fill={color} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            ) : (
                <LineChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#064e3b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#fff',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke={color}
                        strokeWidth={3}
                        dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            )}
        </ResponsiveContainer>
    )
}
