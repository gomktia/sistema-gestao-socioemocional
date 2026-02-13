
'use client'

import { useState } from 'react'
import { createQuestion, updateQuestion, deleteQuestion } from '@/app/actions/form-questions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PencilIcon, TrashIcon, PlusIcon, Search, AlertCircle, Save } from 'lucide-react'

// Tipos
interface FormQuestion {
    id: string
    number: number
    text: string
    category: string | null
    type: 'VIA_STRENGTHS' | 'SRSS_IE'
    isActive: boolean
    order: number
    weight: number
}

interface FormQuestionsManagerProps {
    initialQuestions: FormQuestion[]
}

export function FormQuestionsManager({ initialQuestions }: FormQuestionsManagerProps) {
    const [questions, setQuestions] = useState<FormQuestion[]>(initialQuestions)
    const [search, setSearch] = useState('')
    const [selectedType, setSelectedType] = useState<'ALL' | 'VIA_STRENGTHS' | 'SRSS_IE'>('ALL')

    // Estado do Modal
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState<Partial<FormQuestion>>({})

    // Estado de Loading
    const [isLoading, setIsLoading] = useState(false)

    // Filtros
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase()) ||
            q.number.toString().includes(search) ||
            q.category?.toLowerCase().includes(search.toLowerCase())
        const matchesType = selectedType === 'ALL' || q.type === selectedType
        return matchesSearch && matchesType
    })

    // Handler: Abrir Modal de Criação
    const handleNew = () => {
        setIsEditing(false)
        setCurrentQuestion({
            type: 'VIA_STRENGTHS',
            isActive: true,
            number: questions.length + 1
        })
        setIsOpen(true)
    }

    // Handler: Abrir Modal de Edição
    const handleEdit = (question: FormQuestion) => {
        setIsEditing(true)
        setCurrentQuestion(question)
        setIsOpen(true)
    }

    // Handler: Salvar (Criar ou Atualizar)
    const handleSave = async () => {
        if (!currentQuestion.text || !currentQuestion.number || !currentQuestion.type) {
            alert("Preencha todos os campos obrigatórios")
            return
        }

        setIsLoading(true)
        try {
            if (isEditing && currentQuestion.id && currentQuestion.isActive !== undefined) {
                // Update
                const res = await updateQuestion(currentQuestion.id, {
                    text: currentQuestion.text,
                    number: Number(currentQuestion.number),
                    category: currentQuestion.category || undefined,
                    type: currentQuestion.type,
                    isActive: currentQuestion.isActive
                })
                if (res.success && res.data) {
                    setQuestions(prev => prev.map(q => q.id === res.data.id ? res.data : q))
                    setIsOpen(false)
                } else {
                    alert('Erro ao atualizar: ' + res.error)
                }
            } else {
                // Create
                const res = await createQuestion({
                    text: currentQuestion.text,
                    number: Number(currentQuestion.number),
                    category: currentQuestion.category || undefined,
                    type: currentQuestion.type as any,
                    isActive: currentQuestion.isActive
                })
                if (res.success && res.data) {
                    setQuestions(prev => [...prev, res.data])
                    setIsOpen(false)
                } else {
                    alert('Erro ao criar: ' + res.error)
                }
            }
        } catch (e) {
            console.error(e)
            alert('Erro inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    // Handler: Deletar
    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta pergunta? Esta ação pode afetar relatórios existentes.')) return

        try {
            const res = await deleteQuestion(id)
            if (res.success) {
                setQuestions(prev => prev.filter(q => q.id !== id))
            } else {
                alert('Erro ao deletar: ' + res.error)
            }
        } catch (e) {
            console.error(e)
            alert('Erro inesperado')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por texto, número ou categoria..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        className="h-10 px-3 rounded-md border border-input bg-white text-sm"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                    >
                        <option value="ALL">Todos os Tipos</option>
                        <option value="VIA_STRENGTHS">VIA (Forças)</option>
                        <option value="SRSS_IE">SRSS-IE (Risco)</option>
                    </select>

                    <Button onClick={handleNew} className="bg-brand-600 hover:bg-brand-700">
                        <PlusIcon className="mr-2 h-4 w-4" /> Nova Pergunta
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredQuestions.map(question => (
                    <Card key={question.id} className="w-full bg-white hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
                            <div className="flex items-center gap-3">
                                <Badge variant={question.type === 'VIA_STRENGTHS' ? 'default' : 'secondary'} className={question.type === 'VIA_STRENGTHS' ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}>
                                    {question.type === 'VIA_STRENGTHS' ? 'VIA' : 'SRSS'}
                                </Badge>
                                <span className="font-mono text-sm text-muted-foreground">#{question.number}</span>
                                {question.category && (
                                    <Badge variant="outline" className="text-xs bg-slate-50">
                                        {question.category}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(question)}>
                                    <PencilIcon className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(question.id)}>
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <p className="text-sm font-medium text-slate-900 leading-relaxed">
                                {question.text}
                            </p>
                            {!question.isActive && (
                                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Inativa
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {filteredQuestions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                        Nenhuma pergunta encontrada com os filtros atuais.
                    </div>
                )}
            </div>

            {/* Modal de Edição/Criação */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Pergunta' : 'Nova Pergunta'}</DialogTitle>
                        <DialogDescription>
                            Configure os detalhes da pergunta do formulário.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Tipo</Label>
                            <select
                                id="type"
                                className="col-span-3 h-10 px-3 rounded-md border border-input bg-white text-sm w-full"
                                value={currentQuestion.type || 'VIA_STRENGTHS'}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as any })}
                            >
                                <option value="VIA_STRENGTHS">VIA (Forças)</option>
                                <option value="SRSS_IE">SRSS-IE (Risco)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="number" className="text-right">Número</Label>
                            <Input
                                id="number"
                                type="number"
                                value={currentQuestion.number || ''}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, number: Number(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="order" className="text-right">Ordem</Label>
                            <Input
                                id="order"
                                type="number"
                                value={currentQuestion.order || 0}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, order: Number(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="weight" className="text-right">Peso</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={currentQuestion.weight || 1}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, weight: Number(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>



                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Categoria</Label>
                            <Input
                                id="category"
                                placeholder="Ex: Coragem, Externalizante..."
                                value={currentQuestion.category || ''}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="text" className="text-right pt-2">Texto</Label>
                            <Textarea
                                id="text"
                                value={currentQuestion.text || ''}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                className="col-span-3 min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="active" className="text-right">Status</Label>
                            <div className="flex items-center space-x-2 col-span-3">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={currentQuestion.isActive ?? true}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, isActive: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
                                />
                                <label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Ativa
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isLoading} className="bg-brand-600">
                            {isLoading ? 'Salvando...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
