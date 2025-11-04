// useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../authService.js";
import { Alerts } from "@/shared/alerts";

const useLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación de campos
      if (!form.email.trim()) {
        Alerts.error("El correo es obligatorio");
        return;
      }

      if (!form.password) {
        Alerts.error("La contraseña es obligatoria");
        return;
      }

      // Mostrar carga
      const loadingAlert = Alerts.loading("Iniciando sesión...");

      // Llamada al servicio
      const response = await login(form);

      // Cerrar alerta de carga
      loadingAlert.close();

      if (!response.success) {
        Alerts.error(response.err || "Error al iniciar sesión");
        return;
      }

      // Navegación y feedback
      Alerts.success("¡Bienvenido!");
      if (response.data.role == "admin") {
        navigate("/admin/students");
      } else if (response.data.role == "student") {
        navigate("/dashboard/student");
      } else if (response.data.role == "professor") {
        navigate("/dashboard/faculty");
      } else if (response.data.role == "outsider") {
        navigate("/dashboard");
      }
    } catch (err) {
      Alerts.error(err.message || "Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
