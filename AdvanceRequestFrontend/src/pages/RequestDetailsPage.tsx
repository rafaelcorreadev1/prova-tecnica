import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdvanceRequestById } from '@/services/advanceRequestService';
import { Button } from '@/components/ui/button';

export default function RequestDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['advanceRequest', id],
        queryFn: () => getAdvanceRequestById(id!),
        enabled: !!id,
    });

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-200 via-white to-gray-200 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Detalhes da Solicitação</h1>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Voltar
                    </Button>
                </div>

                {isLoading && <p>Carregando...</p>}
                {isError && <p>Erro ao carregar a solicitação.</p>}

                {data && (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>ID:</strong> {data.id}</p>
                        <p><strong>Contrato:</strong> {data.contractCode}</p>
                        <p><strong>Cliente:</strong> {data.clientId}</p>
                        <p><strong>Status:</strong> {data.status}</p>
                        <p><strong>Parcelas:</strong> {data.installments.join(', ')}</p>
                        <p><strong>Data:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
