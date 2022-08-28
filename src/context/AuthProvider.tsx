import { createContext, ReactNode, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthState {
  accessToken?: string;
}

export interface AuthContent {
  auth: AuthState;
  setAuth: (state: AuthState) => any;
}

const AuthContext = createContext<AuthContent>({ auth: {}, setAuth: () => {} });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({});

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
