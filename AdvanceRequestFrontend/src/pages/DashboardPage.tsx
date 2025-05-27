/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdvanceRequests, approveAdvanceRequests } from '@/services/advanceRequestService';
import type { AdvanceRequest } from '@/services/advanceRequestService';
import { useState } from 'react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { data, isLoading } = useQuery<AdvanceRequest[]>({
        queryKey: ['advanceRequests'],
        queryFn: getAdvanceRequests,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true,
        staleTime: 0
    });

    const { mutate: approve, isPending: isApproving } = useMutation({
        mutationFn: approveAdvanceRequests,
        onSuccess: () => {
            alert('Solicitações aprovadas!');
            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ['advanceRequests'] });
        },
        onError: () => {
            alert('Erro ao aprovar solicitações.');
        },
    });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-200 via-white to-gray-200 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Bem-vindo, {user?.contractCode}</h1>
                    <Button variant="outline" onClick={logout}>Sair</Button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <Button onClick={() => navigate('/parcelas')}>
                        Parcelas
                    </Button>
                    {selectedIds.length > 0 && (
                        <Button
                            variant="default"
                            disabled={isApproving}
                            onClick={() => approve(selectedIds)}
                        >
                            {isApproving ? 'Aprovando...' : 'Aprovar Selecionadas'}
                        </Button>
                    )}
                </div>

                <div className="bg-gray-50 rounded-xl shadow-inner p-4">
                    <h2 className="text-xl font-semibold mb-4">Solicitações de Antecipação</h2>

                    {isLoading && <p>Carregando...</p>}

                    {!isLoading && data?.length === 0 && (
                        <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
                    )}

                    {!isLoading && data?.map(req => req.installments.length > 0 && (
                        <div key={req.id} className="flex items-center gap-2 border-b py-4 text-sm text-gray-700">

                            <div className="space-y-1">
                                {/* <p>
                                    <strong>ID:</strong>{' '}
                                    <a href={`/solicitacao/${req.id}`} className="text-blue-600 underline">
                                        {req.id}
                                    </a>
                                </p> */}
                                <p><strong>Contrato:</strong> {req.contractCode}</p>

                                <div className="space-y-2">
                                    <p className="font-semibold">Parcelas:</p>
                                    {req?.installments?.map((i: any) => (
                                        <div key={i.installmentCode} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedIds.includes(i.installmentCode)}
                                                onCheckedChange={() => toggleSelect(i.installmentCode)}
                                                className="w-5 h-5 border-gray-400"
                                                disabled={req.contractCode != user?.contractCode}
                                            />
                                            <span>{i.installmentCode}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
