import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../projectsService.js";
import { createErrorFromResponse, processFieldErrors, ValidationError, AuthenticationError } from "@/utils/errorHandler";
import { Alerts } from "@/shared/alerts";

export default function useRequestProject() {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    deadline: "",
    selectedBannerUuid: "", // UUID del banner default
    projectType: [],
    faculty: [],
    problemType: [],
    problemTypeOther: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && Array.isArray(form[name])) {
      setForm((prev) => {
        const currentArray = prev[name];
        return {
          ...prev,
          [name]: checked
            ? [...currentArray, value]
            : currentArray.filter((v) => v !== value),
        };
      });
      return;
    }

    // Campos de texto/date/hidden
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({}); // Limpiar errores previos

    // Mostrar loading
    Alerts.loading("Enviando solicitud...");

    // Construir FormData
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("shortDescription", form.shortDescription);
    fd.append("description", form.description);
    fd.append("deadline", form.deadline);

    // Banner: UUID o archivo (exclusivo)
    if (form.selectedBannerUuid) {
      fd.append("selectedBannerUuid", form.selectedBannerUuid);
    }
    const bannerInput = document.querySelector('input[name="customBannerFile"]');
    if (bannerInput?.files?.[0]) {
      fd.append("customBannerFile", bannerInput.files[0]);
    }

    // Arrays opcionales
    form.projectType.forEach((id) => fd.append("projectType", id));
    form.faculty.forEach((id) => fd.append("faculty", id));
    form.problemType.forEach((id) => fd.append("problemType", id));
    if (form.problemTypeOther) fd.append("problemTypeOther", form.problemTypeOther);

    // Attachments
    const attachmentsInput = document.querySelector('input[name="attachments"]');
    if (attachmentsInput?.files) {
      Array.from(attachmentsInput.files).forEach((file) => {
        fd.append("attachments", file);
      });
    }

    try {
      const res = await createApplication(fd);

      if (!res.success) {
        // Crear error tipado desde la respuesta del backend
        const error = createErrorFromResponse(res.err);

        // Manejar error de autenticación (401)
        if (error instanceof AuthenticationError) {
          Alerts.warning("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Manejar errores de validación (400 con details)
        if (error instanceof ValidationError && error.details?.length > 0) {
          // Procesar errores por campo para mostrar en el formulario
          const errors = processFieldErrors(error.details);
          setFieldErrors(errors);

          // Mostrar el primer error en el toast
          const firstFieldError = Object.values(errors)[0];
          Alerts.error(firstFieldError?.message || "Por favor, corrige los errores del formulario");
          return;
        }

        // Otros errores (ConflictError, NotFoundError, etc.)
        Alerts.error(error.message || "No se pudo crear la solicitud");
        return;
      }

      // Éxito
      Alerts.success("¡Tu proyecto ha sido enviado correctamente!");
      setTimeout(() => navigate("/explore-projects"), 3000);

    } catch (err) {
      console.error("Error inesperado:", err);
      Alerts.error("Ocurrió un problema inesperado. Por favor, intenta nuevamente.");
    }
  };

  return { form, fieldErrors, handleChange, handleSubmit };
}