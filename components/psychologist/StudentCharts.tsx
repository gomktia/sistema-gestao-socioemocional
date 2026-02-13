
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Badge } from "@/components/ui/badge"

interface StudentChartsProps {
    evolutionData: {
        window: string
        externalizing: number
        internalizing: number
    }[]
    viaScores?: Record<string, number> // Scores das 24 forças
}

const VIRTUE_MAPPING: Record<string, string[]> = {
    'Sabedoria': ['Criatividade', 'Curiosidade', 'Critério', 'Amor ao Aprendizado', 'Perspectiva'],
    'Coragem': ['Bravura', 'Perseverança', 'Honestidade', 'Vitalidade'],
    'Humanidade': ['Amor', 'Bondade', 'Inteligência Social'],
    'Justiça': ['Trabalho em Equipe', 'Equidade', 'Liderança'],
    'Moderação': ['Perdão', 'Humildade', 'Prudência', 'Autocontrole'],
    'Transcendência': ['Apreciação da Beleza', 'Gratidão', 'Esperança', 'Humor', 'Espiritualidade']
}

export function StudentCharts({ evolutionData, viaScores }: StudentChartsProps) {
    // Processar dados para o Radar Chart (Agrupado por Virtude)
    const radarData = viaScores ? Object.entries(VIRTUE_MAPPING).map(([virtue, strengths]) => {
        const totalScore = strengths.reduce((acc, strength) => acc + (viaScores[strength] || 0), 0)
        const average = strengths.length ? Math.round((totalScore / strengths.length) * 10) / 10 : 0
        return {
            subject: virtue,
            A: average,
            fullMark: 5 // Escala VIA geralmente é 1-5? Verificar. Assumindo 5.
        }
    }) : []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de Evolução de Risco (SRSS) */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        Evolução do Risco (SRSS-IE)
                    </CardTitle>
                    <CardDescription>
                        Acompanhamento longitudinal dos fatores de risco.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {evolutionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolutionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="window" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="externalizing"
                                    name="Externalizante"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="internalizing"
                                    name="Internalizante"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                            Dados insuficientes para gerar histórico.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Gráfico Radar (VIA Virtudes) */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        Perfil de Virtudes (VIA)
                    </CardTitle>
                    <CardDescription>
                        Distribuição das forças agrupadas por virtude.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {radarData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                <Radar
                                    name="Virtudes"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="#8b5cf6"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                            Questionário VIA ainda não respondido.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
