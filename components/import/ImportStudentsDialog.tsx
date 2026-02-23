'use client';

import { useState, useCallback, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { parseImportFile, executeImport, type ImportPreview } from '@/app/actions/import-students';
import { toast } from 'sonner';

type Step = 'upload' | 'preview' | 'result';

interface ImportResult {
  created: number;
  classroomsCreated: number;
  skipped: number;
}

export function ImportStudentsDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('upload');
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = useCallback(() => {
    setStep('upload');
    setPreview(null);
    setResult(null);
    setError(null);
    setDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 200);
  }, [reset]);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      const res = await parseImportFile(formData);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setPreview(res.preview);
      setStep('preview');
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleConfirmImport = useCallback(() => {
    if (!preview) return;

    startTransition(async () => {
      const res = await executeImport(
        preview.valid.map(r => ({ data: r.data })),
        preview.newClassrooms
      );
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setResult({ created: res.created, classroomsCreated: res.classroomsCreated, skipped: res.skipped });
      setStep('result');
      toast.success(`${res.created} alunos importados com sucesso!`);
    });
  }, [preview]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl active:scale-95 transition-all"
      >
        <Upload size={16} className="mr-2" />
        Importar Alunos
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">
              {step === 'upload' && 'Importar Alunos'}
              {step === 'preview' && 'Confirmar Importacao'}
              {step === 'result' && 'Importacao Concluida'}
            </DialogTitle>
            <DialogDescription>
              {step === 'upload' && 'Envie um arquivo CSV ou Excel com os dados dos alunos.'}
              {step === 'preview' && 'Revise os dados antes de confirmar.'}
              {step === 'result' && 'Veja o resumo da importacao.'}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {isPending ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={40} className="text-indigo-500 animate-spin" />
                  <p className="text-sm text-slate-600 font-medium">Processando arquivo...</p>
                </div>
              ) : (
                <>
                  <FileSpreadsheet size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm text-slate-600 mb-1 font-medium">
                    Arraste um arquivo CSV ou Excel aqui
                  </p>
                  <p className="text-xs text-slate-400 mb-4">ou clique para selecionar (max 5MB)</p>
                  <label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <span className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors">
                      Selecionar Arquivo
                    </span>
                  </label>
                </>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && preview && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Summary badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                  {preview.valid.length} validos
                </span>
                {preview.errors.length > 0 && (
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">
                    {preview.errors.length} com erros
                  </span>
                )}
                {preview.duplicates.length > 0 && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                    {preview.duplicates.length} duplicados
                  </span>
                )}
                {preview.newClassrooms.length > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                    {preview.newClassrooms.length} turmas novas
                  </span>
                )}
              </div>

              {/* New classrooms alert */}
              {preview.newClassrooms.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                  <strong>Turmas novas que serao criadas:</strong>{' '}
                  {preview.newClassrooms.join(', ')}
                </div>
              )}

              {/* Valid rows table */}
              {preview.valid.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Linha</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Nome</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Turma</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Matricula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.valid.slice(0, 50).map((r) => (
                        <tr key={r.row} className="hover:bg-slate-50">
                          <td className="px-3 py-2 text-slate-400">{r.row}</td>
                          <td className="px-3 py-2 font-medium">{r.data.name}</td>
                          <td className="px-3 py-2">{r.data.classroomName}</td>
                          <td className="px-3 py-2 text-slate-500">{r.data.enrollmentId || '—'}</td>
                        </tr>
                      ))}
                      {preview.valid.length > 50 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-2 text-center text-slate-400 text-xs">
                            ... e mais {preview.valid.length - 50} alunos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Error rows */}
              {preview.errors.length > 0 && (
                <div className="border border-red-200 rounded-xl overflow-hidden">
                  <div className="bg-red-50 px-3 py-2 text-xs font-bold text-red-700 uppercase">
                    Linhas com Erros (nao serao importadas)
                  </div>
                  <div className="divide-y divide-red-100">
                    {preview.errors.slice(0, 20).map((r) => (
                      <div key={r.row} className="px-3 py-2 text-sm">
                        <span className="text-red-500 font-bold">Linha {r.row}:</span>{' '}
                        <span className="text-red-700">{r.errors.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate rows */}
              {preview.duplicates.length > 0 && (
                <div className="border border-amber-200 rounded-xl overflow-hidden">
                  <div className="bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 uppercase">
                    Duplicados (serao ignorados)
                  </div>
                  <div className="divide-y divide-amber-100">
                    {preview.duplicates.map((r) => (
                      <div key={r.row} className="px-3 py-2 text-sm">
                        <span className="text-amber-600 font-bold">Linha {r.row}:</span>{' '}
                        {r.data.name} — <span className="text-amber-700">{r.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && result && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">{result.created} alunos importados</p>
                {result.classroomsCreated > 0 && (
                  <p className="text-sm text-slate-500">{result.classroomsCreated} turmas criadas</p>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2">
            {step === 'preview' && (
              <>
                <Button variant="outline" onClick={reset} className="rounded-xl" disabled={isPending}>
                  <ArrowLeft size={16} className="mr-1" /> Voltar
                </Button>
                <Button
                  onClick={handleConfirmImport}
                  disabled={isPending || preview?.valid.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  {isPending ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Importando...</>
                  ) : (
                    <>Confirmar Importacao ({preview?.valid.length} alunos)</>
                  )}
                </Button>
              </>
            )}
            {step === 'result' && (
              <Button onClick={handleClose} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
