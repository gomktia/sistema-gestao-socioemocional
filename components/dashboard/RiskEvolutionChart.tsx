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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f1f5f9' }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}
                    />
                    <Bar
                        dataKey="Baixo Risco"
                        stackId="a"
                        fill="#10b981"
                        radius={[0, 0, 4, 4]}
                        barSize={60}
                    />
                    <Bar
                        dataKey="Risco Moderado"
                        stackId="a"
                        fill="#f59e0b"
                    />
                    <Bar
                        dataKey="Alto Risco"
                        stackId="a"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
