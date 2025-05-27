/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [contractCode, setContractCode] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(contractCode);
    } catch (error: any) {
      console.error('Erro no login:', error);
      alert('Login inválido.');
    }
  };;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        <Input
          type="text"
          placeholder="Código do Contrato"
          value={contractCode}
          onChange={(e) => setContractCode(e.target.value)}
        />

        <Button variant="outline" className="w-full" type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}
