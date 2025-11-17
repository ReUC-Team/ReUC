import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        
        if (token) {
          // Decodificar el token para obtener la información del usuario
          const decoded = jwtDecode(token);
          
          // El rol viene en formato "professor:uuid_role" según tu backend
          const userRole = decoded.role?.split(':')[0] || null;
          
          setUser({
            uuid: decoded.uuid_user,
            role: userRole,
            ip: decoded.ip,
            userAgent: decoded.ua
          });
          setRole(userRole);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Si el token está corrupto o expiró, limpiarlo
        sessionStorage.removeItem('accessToken');
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, accessToken) => {
    // Guardar el token
    sessionStorage.setItem('accessToken', accessToken);
    
    try {
      const decoded = jwtDecode(accessToken);
      const userRole = decoded.role?.split(':')[0] || null;
      
      setUser({
        uuid: userData.uuid_user,
        email: userData.email,
        role: userRole
      });
      setRole(userRole);
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout del backend
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar estado local siempre
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('dashboardProfileModalShown');
      sessionStorage.removeItem('profileModalShown');
      sessionStorage.clear();
      
      setUser(null);
      setRole(null);
    }
  };

  const value = {
    user,
    role,
    isLoading,
    login,
    logout,
    // Helpers para verificar roles
    isStudent: role === 'student',
    isProfessor: role === 'professor',
    isOutsider: role === 'outsider',
    isAdmin: role === 'admin',
    // Helper para verificar si está autenticado
    isAuthenticated: !!user && !!role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};