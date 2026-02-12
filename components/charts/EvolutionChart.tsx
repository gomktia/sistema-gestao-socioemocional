'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface EvolutionPoint {
    window: string; // "Março", "Junho", "Outubro"
    externalizing: number;
    internalizing: number;
}

interface EvolutionChartProps {
    data: EvolutionPoint[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="window"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                    />
                    <YAxis
                        domain={[0, 21]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <Line
                        name="Externalizante"
                        type="monotone"
                        dataKey="externalizing"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#f43f5e' }}
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        name="Internalizante"
                        type="monotone"
                        dataKey="internalizing"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#6366f1' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
