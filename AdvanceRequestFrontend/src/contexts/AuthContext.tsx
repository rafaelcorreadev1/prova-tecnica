import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

interface User {
  contractCode: string;
  clientName: string;
  clientId: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (contractCode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // 🆕 controle de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setIsAuthReady(true); // 🆕 libera renderização quando o efeito terminar
  }, []);

  const login = async (contractCode: string) => {
    const response = await api.post('/auth/login', { ContractCode: contractCode });

    const newUser: User = {
      clientId: response.data.clientId,
      contractCode: response.data.contractCode,
      clientName: response.data.clientName,
      token: response.data.token,
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    api.defaults.headers.common['Authorization'] = `Bearer ${newUser.token}`;
    setUser(newUser);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {isAuthReady ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
