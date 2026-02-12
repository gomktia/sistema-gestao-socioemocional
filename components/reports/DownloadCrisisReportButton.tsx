'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { CrisisProtocolReport } from './CrisisProtocolReport';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface DownloadCrisisReportButtonProps {
    studentName: string;
    grade: string;
    riskTier: string;
    externalizingScore: number;
    internalizingScore: number;
    criticalAlerts: any[];
}

export function DownloadCrisisReportButton(props: DownloadCrisisReportButtonProps) {
    return (
        <PDFDownloadLink
            document={<CrisisProtocolReport {...props} />}
            fileName={`Protocolo_Crise_${props.studentName.replace(/ /g, '_')}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button
                    className="w-full bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"
                    disabled={loading}
                    size="sm"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ShieldAlert className="mr-2 h-4 w-4" />
                    )}
                    Ativar Protocolo e Gerar PDF
                </Button>
            )}
        </PDFDownloadLink>
    );
}
