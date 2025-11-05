import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../authService.js";
import { 
  ValidationError, 
  processFieldErrors, 
  getDisplayMessage 
} from "@/utils/errorHandler";
import { Alerts } from "@/shared/alerts";

export default function useRegister() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    universityId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // Errores por campo
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({}); // Limpiar errores previos

    try {
      // Elimine las validaciones manuales (ahora las hace el backend)
      // Solo validar términos y condiciones en frontend
      if (!form.acceptTerms) {
        Alerts.error("Debes aceptar los términos y condiciones");
        return;
      }

      // Mostrar carga
      const loadingAlert = Alerts.loading("Registrando cuenta...");

      // Llamar al servicio (lanzará errores estructurados)
      const response = await register(form);
      
      loadingAlert.close();

      // El servicio ya lanza excepciones, si llegamos aquí es éxito
      Alerts.success("¡Registro exitoso! Bienvenido a ReUC");
      navigate("/login"); // Redirigir a login para que inicie sesión

    } catch (error) {
      console.error("Registration error:", error);

      // Procesar errores de validación por campo
      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          // Convertir errores del backend a formato por campo
          const processedErrors = processFieldErrors(error.details);
          setFieldErrors(processedErrors);

          // Mostrar alerta general
          Alerts.error(
            "Hay errores en el formulario. Por favor revisa los campos marcados."
          );
        } else {
          // Error de validación sin detalles específicos
          Alerts.error(getDisplayMessage(error));
        }
      } else {
        // Otros tipos de error (AuthenticationError, ConflictError, etc.)
        Alerts.error(getDisplayMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    isLoading,
    fieldErrors, // Exponer errores por campo
  };
}