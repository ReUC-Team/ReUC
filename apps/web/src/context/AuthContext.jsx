import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Obtener información del usuario desde localStorage o API
    const loadUser = async () => {
      try {
        // Opción 1: Desde localStorage (si guardas la sesión ahí)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Opción 2: Llamar a un endpoint que devuelva el usuario actual
        // const response = await fetch(`${API_URL}/auth/me`, {
        //   credentials: 'include'
        // });
        // const data = await response.json();
        // setUser(data.user);

      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    // ✅ Helpers para verificar roles
    isStudent: user?.role === 'student',
    isFaculty: user?.role === 'professor',
    isOutsider: user?.role === 'outsider',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};