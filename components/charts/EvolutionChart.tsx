'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart
} from 'recharts';

interface EvolutionPoint {
    window: string;
    externalizing: number;
    internalizing: number;
}

interface EvolutionChartProps {
    data: EvolutionPoint[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="gradExt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradInt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="window"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
                    />
                    <YAxis
                        domain={[0, 21]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '10px 14px',
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
                    />
                    <Area
                        name="Externalizante"
                        type="monotone"
                        dataKey="externalizing"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        fill="url(#gradExt)"
                        dot={{ r: 5, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 7, stroke: '#f43f5e', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Area
                        name="Internalizante"
                        type="monotone"
                        dataKey="internalizing"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#gradInt)"
                        dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 7, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
