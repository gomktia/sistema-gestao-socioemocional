'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { generateExcelReport } from '@/app/actions/reports';
import { useState } from 'react';
import { toast } from 'sonner';

export function ExcelExportButton() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const result = await generateExcelReport();

            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success && result.base64) {
                // Decode base64 and download
                const binaryString = window.atob(result.base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename || 'relatorio.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success('Relatório exportado com sucesso!');
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Erro ao gerar relatório.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
            {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Download className="mr-2" size={16} />}
            Exportar Excel
        </Button>
    );
}
