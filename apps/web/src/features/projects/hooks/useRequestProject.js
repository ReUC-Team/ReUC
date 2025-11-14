import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../projectsService.js";
import { ValidationError, processFieldErrors, getDisplayMessage } from "@/utils/errorHandler";
import { Alerts } from "@/shared/alerts";

export default function useRequestProject() {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    deadline: "",
    selectedBannerUuid: "",
    customBannerFile: null,
    customBannerName: "",
    projectType: [], 
    faculty: [], 
    problemType: [],
    problemTypeOther: "",
    attachments: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Limpiar error del campo cuando el usuario interactúa
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // MANEJO DE CHECKBOXES (projectType, faculty, problemType)
    if (type === "checkbox") {
      if (name === "projectType" || name === "faculty" || name === "problemType") {
        setForm(prevForm => {
          const currentArray = prevForm[name] || [];
          
          if (checked) {
            // Agregar valor si está checkeado
            return {
              ...prevForm,
              [name]: [...currentArray, value]
            };
          } else {
            // Remover valor si está desmarcado
            return {
              ...prevForm,
              [name]: currentArray.filter(item => item !== value)
            };
          }
        });
        return; // salir de la función aquí
      }
    }

    // Manejo de archivos de banner
    if (name === "customBannerFile" && files?.[0]) {
      setForm({
        ...form,
        customBannerFile: files[0],
        customBannerName: files[0].name,
        selectedBannerUuid: "", // Limpiar UUID si se sube archivo
      });
      return;
    } 
    
    // Manejo de archivos adjuntos
    if (name === "attachments" && files) {
      setForm({
        ...form,
        attachments: Array.from(files),
      });
      return;
    } 
    
    // Campos de texto normales
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Manejo de banner predefinido (llamado desde RequestProjectForm)
  const handleBannerSelection = (uuid) => {
    setForm({
      ...form,
      selectedBannerUuid: uuid,
      customBannerFile: null,
      customBannerName: "",
    });

    // Limpiar error de banner
    if (fieldErrors.banner) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.banner;
        return newErrors;
      });
    }
  };

  // Remover archivo adjunto (llamado desde RequestProjectForm)
  const handleRemoveAttachment = (index) => {
    setForm(prevForm => ({
      ...prevForm,
      attachments: prevForm.attachments.filter((_, i) => i !== index),
    }));
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {};

    if (!form.title?.trim()) {
      errors.title = "El título es requerido";
    }

    if (!form.shortDescription?.trim()) {
      errors.shortDescription = "La descripción corta es requerida";
    }

    if (!form.description?.trim()) {
      errors.description = "La descripción detallada es requerida";
    }

    if (!form.deadline) {
      errors.deadline = "La fecha límite es requerida";
    }

    if (!form.selectedBannerUuid && !form.customBannerFile) {
      errors.banner = "Debes seleccionar o subir un banner";
    }

    // Validar que los arrays tengan al menos un elemento (si son requeridos)
    // Según el formulario, estos son opcionales, así que no validamos

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      Alerts.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    try {
      // Construir FormData
      const formData = new FormData();

      // Campos básicos
      formData.append("title", form.title);
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.description);
      formData.append("deadline", form.deadline);

      // Banner (UUID o archivo, exclusivo)
      if (form.selectedBannerUuid) {
        formData.append("selectedBannerUuid", form.selectedBannerUuid);
      } else if (form.customBannerFile) {
        formData.append("customBannerFile", form.customBannerFile);
      }

      // Enviar cada ID individualmente con []
      // Solo enviar si hay elementos
      if (form.projectType && form.projectType.length > 0) {
        form.projectType.forEach(id => {
          formData.append("projectType[]", id);
        });
      }

      if (form.faculty && form.faculty.length > 0) {
        form.faculty.forEach(id => {
          formData.append("faculty[]", id);
        });
      }

      if (form.problemType && form.problemType.length > 0) {
        form.problemType.forEach(id => {
          formData.append("problemType[]", id);
        });
      }

      // Tipo de problemática "Otro"
      if (form.problemTypeOther?.trim()) {
        formData.append("problemTypeOther", form.problemTypeOther);
      }

      // Archivos adjuntos
      if (form.attachments && form.attachments.length > 0) {
        form.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Enviar al backend
      const response = await createApplication(formData);

      Alerts.success("¡Tu proyecto ha sido enviado correctamente!");
      
      setTimeout(() => {
        navigate("/my-applications");
      }, 2000);

    } catch (error) {

      // Manejo de errores de validación
      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors = processFieldErrors(error.details);
          setFieldErrors(processedErrors);
          
          Alerts.error("Por favor revisa los campos marcados");
        } else {
          Alerts.error(getDisplayMessage(error));
        }
      } 
      // Otros errores
      else {
        Alerts.error(getDisplayMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    fieldErrors,
    isLoading,
    handleChange,
    handleBannerSelection,
    handleRemoveAttachment,
    handleSubmit,
  };
}