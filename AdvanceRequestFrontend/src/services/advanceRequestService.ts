import { api } from './api';

export interface AdvanceRequest {
    id: string;
    clientId: string;
    contractCode: string;
    installments: string[];
    createdAt: string;
    status: 'pending' | 'approved';
}

interface CreateAdvanceRequestDto {
    clientId: string;
    contractCode: string;
    installmentCodes: string[];
}


interface Installment {
    installmentCode: string;
    dueDate: string;
    amount: number;
    status: string;
    anticipated: boolean;
}

interface ContractAdvanceResponse {
    clientId: string;
    contractCode: string;
    clientName: string;
    installments: Installment[];
}


export const getAdvanceRequests = async (): Promise<AdvanceRequest[]> => {
    const response = await api.get('/advance-request');
    return response.data;
};


export const createAdvanceRequest = async (data: CreateAdvanceRequestDto) => {
    const response = await api.post('/advance-request', data);
    return response.data;
};

export const getAdvanceRequestById = async (id: string): Promise<AdvanceRequest> => {
    const response = await api.get(`/advance-request/${id}`);
    return response.data;
};

export const approveAdvanceRequests = async (installmentCodes: string[]) => {
    const response = await api.put('/advance-request/approve', { installmentCodes });
    return response.data;
};


export const getInstallments = async (id: string): Promise<ContractAdvanceResponse> => {
    const response = await api.get(`/advance-request/${id}`);
    return response.data;
};
