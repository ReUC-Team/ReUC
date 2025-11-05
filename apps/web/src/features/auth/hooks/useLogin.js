import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../authService.js";
import { 
  ValidationError, 
  AuthenticationError,
  processFieldErrors, 
  getDisplayMessage 
} from "@/utils/errorHandler";
import { Alerts } from "@/shared/alerts";

const useLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // Errores por campo
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({}); // Limpiar errores previos

    try {
      // Mostrar carga
      const loadingAlert = Alerts.loading("Iniciando sesión...");

      // Llamar al servicio (ahora lanza excepciones)
      const { user } = await login(form);
      
      loadingAlert.close();

      // Éxito - Navegar según rol
      Alerts.success("¡Bienvenido a ReUC!");

      // Navegación según rol
      const roleRoutes = {
        admin: "/admin/students",
        student: "/dashboard/student",
        professor: "/dashboard/faculty",
        outsider: "/dashboard"
      };

      const targetRoute = roleRoutes[user.role] || "/dashboard";
      navigate(targetRoute);

    } catch (error) {
      console.error("Login error:", error);

      // Manejo específico por tipo de error
      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors = processFieldErrors(error.details);
          setFieldErrors(processedErrors);
          Alerts.error("Por favor revisa los campos marcados");
        } else {
          Alerts.error(getDisplayMessage(error));
        }
      } else if (error instanceof AuthenticationError) {
        // Error de credenciales inválidas
        Alerts.error("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else {
        // Otros errores (red, servidor, etc.)
        Alerts.error(getDisplayMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    fieldErrors,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;