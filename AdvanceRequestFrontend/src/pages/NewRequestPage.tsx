import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getInstallments, createAdvanceRequest } from '@/services/advanceRequestService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewRequestPage() {
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: contract, isLoading } = useQuery({
        queryKey: ['contractAdvanceRequest', user?.contractCode],
        queryFn: () => getInstallments(user!.contractCode),
        enabled: !!user?.contractCode,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 0
    });

    const { mutate: submitRequest, isPending } = useMutation({
        mutationFn: createAdvanceRequest,
        onSuccess: () => {
            alert('Solicitação enviada com sucesso!');
            navigate('/dashboard');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            const message = error?.response?.data?.error || 'Erro ao enviar a solicitação.';
            alert(message);
        },
    });

    const toggleSelection = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSubmit = () => {
        if (!contract || !user) return;

        submitRequest({
            clientId: user.clientId,
            contractCode: contract.contractCode,
            installmentCodes: selected,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-200 via-white to-gray-200 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Parcelas</h1>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Voltar
                    </Button>
                </div>

                {isLoading && <p>Carregando parcelas...</p>}

                {contract && (
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner mb-6">
                        <h2 className="text-lg font-semibold mb-2">{contract.clientName} - {contract.contractCode}</h2>
                        <div className="space-y-2">
                            {contract.installments.map(parcel => (
                                <div key={parcel.installmentCode} className="flex items-center justify-between">
                                    <label className="flex items-center gap-3">
                                        <Checkbox
                                            checked={selected.includes(parcel.installmentCode)}
                                            onCheckedChange={() => toggleSelection(parcel.installmentCode)}
                                            className="w-5 h-5"
                                            disabled={parcel.status == 'paid' || parcel.anticipated}
                                        />
                                        <span>{parcel.installmentCode} - Vencimento: {new Date(parcel.dueDate).toLocaleDateString('pt-BR')} - Valor R$: {parcel.amount.toFixed(2)} - Status: {parcel.status}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Button variant="outline" className="mt-4" disabled={selected.length === 0 || isPending} onClick={handleSubmit}>
                    {isPending ? 'Antecipando...' : 'Antecipar'}
                </Button>
            </div>
        </div>
    );
}