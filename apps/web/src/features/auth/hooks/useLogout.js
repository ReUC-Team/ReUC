import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../authService.js";
import { getDisplayMessage } from "@/utils/errorHandler";
import { Alerts, closeAlert } from "@/shared/alerts";

const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const navigate = useNavigate();

  /**
   * Maneja el logout manual (no automático)
   * Se debe llamar cuando el usuario hace clic en "Cerrar sesión"
   */
  const handleLogout = async () => {
    setIsLoading(true);
    setLogoutError(null);

    // Mostrar alerta de confirmación
    const result = await Alerts.confirm({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres salir?',
      confirmText: 'Sí, cerrar sesión',
      cancelText: 'Cancelar',
      buttonsStyling: false, 
      // ✅ Personalización de colores
      customClass: {
        popup: 'bg-white',
        title: 'text-gray-900',
        htmlContainer: 'text-gray-600',
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg'
      },
      // Desactivar estilos por defecto
    });

    if (!result.isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      // Mostrar carga
      const loadingAlert = Alerts.loading("Cerrando sesión...");

      // Llamar al servicio (ahora lanza excepciones)
      await logout();

      loadingAlert.close();

      // Limpiar estado local
      sessionStorage.removeItem("accessToken");

      // Mostrar éxito
      Alerts.success("Sesión cerrada correctamente");

      // Redirigir a login después de un pequeño delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

    } catch (error) {
      console.error("Logout error:", error);
      
      // Cerrar loading
      closeAlert();

      // Guardar error para mostrar en UI
      const errorMessage = getDisplayMessage(error);
      setLogoutError(errorMessage);
      
      // Mostrar alerta de error
      Alerts.error(errorMessage);

      // Incluso con error, limpiar sesión local
      sessionStorage.removeItem("accessToken");
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogout,
    isLoading,
    logoutError,
  };
};

export default useLogout;