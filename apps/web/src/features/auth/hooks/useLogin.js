import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../authService.js";
import { useAuth } from "@/context/AuthContext.jsx";
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
  const [fieldErrors, setFieldErrors] = useState({}); 
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    setFieldErrors({});

    try {
      const loadingAlert = Alerts.loading("Iniciando sesión...");

      // Llamar al servicio que retorna { user, accessToken }
      const { user, accessToken } = await login(form);
      
      loadingAlert.close();

      // Actualizar el contexto de autenticación
      authLogin(user, accessToken);

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

      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors = processFieldErrors(error.details);
          setFieldErrors(processedErrors);
          Alerts.error("Por favor revisa los campos marcados");
        } else {
          Alerts.error(getDisplayMessage(error));
        }
      } else if (error instanceof AuthenticationError) {
        Alerts.error("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else {
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