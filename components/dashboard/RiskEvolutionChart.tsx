'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface RiskEvolutionChartProps {
    data: any[];
}

export function RiskEvolutionChart({ data }: RiskEvolutionChartProps) {
    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="gradMod" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                            padding: '12px 16px',
                            fontSize: '13px',
                            fontWeight: 600,
                        }}
                        cursor={{ fill: '#f8fafc', radius: 8 }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}
                    />
                    <Bar
                        dataKey="Baixo Risco"
                        stackId="a"
                        fill="url(#gradLow)"
                        radius={[0, 0, 8, 8]}
                        barSize={56}
                    />
                    <Bar
                        dataKey="Risco Moderado"
                        stackId="a"
                        fill="url(#gradMod)"
                    />
                    <Bar
                        dataKey="Alto Risco"
                        stackId="a"
                        fill="url(#gradHigh)"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
