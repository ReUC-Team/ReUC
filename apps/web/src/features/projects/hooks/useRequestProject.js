import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../projectsService.js";
import { ValidationError, processFieldErrors, getDisplayMessage } from "@/utils/errorHandler";
import { Alerts } from "@/shared/alerts";
import useFormProjectMetadata from "./useFormProjectMetadata.js";

export default function useRequestProject() {
  const navigate = useNavigate();
  const { projectTypes } = useFormProjectMetadata();
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

  const [deadlineConstraints, setDeadlineConstraints] = useState({
    min: null,
    max: null,
    projectTypeName: null,
    minMonths: 0,
    maxMonths: 0,
  });

  // Helper para formatear fecha local sin zona horaria
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calcular constraints de fecha cuando cambie el tipo de proyecto
  useEffect(() => {
    if (form.projectType.length > 0 && projectTypes.length > 0) {
      const selectedTypeId = Number(form.projectType[0]);
      const projectType = projectTypes.find(pt => pt.project_type_id === selectedTypeId);
      
      if (projectType) {
        // Fecha actual en zona horaria local
        const today = new Date();
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const minMonths = projectType.minEstimatedMonths || 0;
        const maxMonths = projectType.maxEstimatedMonths || 24;
        
        // Calcular fecha mínima (hoy + minMonths)
        const minDate = new Date(todayLocal);
        minDate.setMonth(minDate.getMonth() + minMonths);
        
        // Calcular fecha máxima (hoy + maxMonths + 1 mes de buffer)
        const maxDate = new Date(todayLocal);
        maxDate.setMonth(maxDate.getMonth() + maxMonths + 1);
        
        setDeadlineConstraints({
          min: formatDateLocal(minDate),
          max: formatDateLocal(maxDate),
          projectTypeName: projectType.name,
          minMonths,
          maxMonths: maxMonths + 1
        });
      }
    } else {
      setDeadlineConstraints({ 
        min: null, 
        max: null, 
        projectTypeName: null,
        minMonths: 0,
        maxMonths: 0
      });
    }
  }, [form.projectType, projectTypes]);

  // Manejar cambios en los campos del formulario
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

    // Manejo de radio button para faculty
    if (type === "radio" && name === "faculty") {
      setForm(prevForm => ({
        ...prevForm,
        faculty: [String(value)]
      }));
      return;
    }

    // Manejo de checkboxes (projectType, problemType)
    if (type === "checkbox") {
      if (name === "projectType" || name === "problemType") {
        setForm(prevForm => {
          const currentArray = prevForm[name] || [];
          
          if (checked) {
            return {
              ...prevForm,
              [name]: [...currentArray, value]
            };
          } else {
            return {
              ...prevForm,
              [name]: currentArray.filter(item => item !== value)
            };
          }
        });
        return;
      }
    }

    // Manejo de archivos de banner
    if (name === "customBannerFile" && files?.[0]) {
      setForm({
        ...form,
        customBannerFile: files[0],
        customBannerName: files[0].name,
        selectedBannerUuid: "",
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

    // Validar fecha en tiempo real
    if (name === "deadline" && value && deadlineConstraints.min) {
      const [year, month, day] = value.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      
      const [minYear, minMonth, minDay] = deadlineConstraints.min.split('-').map(Number);
      const minDate = new Date(minYear, minMonth - 1, minDay);
      
      const [maxYear, maxMonth, maxDay] = deadlineConstraints.max.split('-').map(Number);
      const maxDate = new Date(maxYear, maxMonth - 1, maxDay);

      const today = new Date();
      const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Calcular meses desde hoy
      const monthsDiff = Math.round(
        (selectedDate.getFullYear() - todayLocal.getFullYear()) * 12 +
        (selectedDate.getMonth() - todayLocal.getMonth()) +
        (selectedDate.getDate() - todayLocal.getDate()) / 30
      );

      if (selectedDate < minDate) {
        Alerts.warning(
          `Fecha demasiado pronto. El proyecto debe durar al menos ${deadlineConstraints.minMonths} meses desde hoy`
        );
      } else if (selectedDate > maxDate) {
        Alerts.warning(
          `Fecha demasiado lejana. No puede superar ${deadlineConstraints.maxMonths} meses desde hoy`
        );
      } else {
        Alerts.success(
          `Fecha válida: ${monthsDiff} meses desde hoy`
        );
      }
    }
    
    // Campos de texto normales
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Validar formulario antes de enviar
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
      errors.deadline = "La fecha de vigencia es obligatoria";
    } else if (deadlineConstraints.min && deadlineConstraints.max) {
      const [year, month, day] = form.deadline.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      
      const [minYear, minMonth, minDay] = deadlineConstraints.min.split('-').map(Number);
      const minDate = new Date(minYear, minMonth - 1, minDay);
      
      const [maxYear, maxMonth, maxDay] = deadlineConstraints.max.split('-').map(Number);
      const maxDate = new Date(maxYear, maxMonth - 1, maxDay);

      const today = new Date();
      const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const monthsDiff = Math.round(
        (selectedDate.getFullYear() - todayLocal.getFullYear()) * 12 +
        (selectedDate.getMonth() - todayLocal.getMonth()) +
        (selectedDate.getDate() - todayLocal.getDate()) / 30
      );

      if (selectedDate < minDate) {
        errors.deadline = `Fecha demasiado pronto. El proyecto debe durar al menos ${deadlineConstraints.minMonths} meses desde hoy. Fecha mínima: ${minDate.toLocaleDateString('es-MX', { 
          day: 'numeric',
          month: 'long', 
          year: 'numeric' 
        })}`;
      } else if (selectedDate > maxDate) {
        errors.deadline = `Fecha demasiado lejana. No puede superar ${deadlineConstraints.maxMonths} meses desde hoy (incluyendo 1 mes de margen). Fecha máxima: ${maxDate.toLocaleDateString('es-MX', { 
          day: 'numeric',
          month: 'long', 
          year: 'numeric' 
        })}`;
      }
    }

    if (!form.selectedBannerUuid && !form.customBannerFile) {
      errors.banner = "Debes seleccionar o subir un banner";
    }

    return errors;
  };

  // Seleccionar banner predeterminado
  const handleBannerSelection = (uuid) => {
    setForm({
      ...form,
      selectedBannerUuid: uuid,
      customBannerFile: null,
      customBannerName: "",
    });

    if (fieldErrors.banner) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.banner;
        return newErrors;
      });
    }
  };

  // Remover archivo adjunto por índice
  const handleRemoveAttachment = (index) => {
    setForm(prevForm => ({
      ...prevForm,
      attachments: prevForm.attachments.filter((_, i) => i !== index),
    }));
  };

  // Enviar formulario de solicitud
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      Alerts.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.description);
      formData.append("deadline", form.deadline);

      if (form.selectedBannerUuid) {
        formData.append("selectedBannerUuid", form.selectedBannerUuid);
      } else if (form.customBannerFile) {
        formData.append("customBannerFile", form.customBannerFile);
      }

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

      if (form.problemTypeOther?.trim()) {
        formData.append("problemTypeOther", form.problemTypeOther);
      }

      if (form.attachments && form.attachments.length > 0) {
        form.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      await createApplication(formData);

      Alerts.success("¡Tu proyecto ha sido enviado correctamente!");
      
      setTimeout(() => {
        navigate("/my-applications");
      }, 2000);

    } catch (error) {
      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors = processFieldErrors(error.details);
          setFieldErrors(processedErrors);
          
          Alerts.error("Por favor revisa los campos marcados");
        } else {
          Alerts.error(getDisplayMessage(error));
        }
      } else {
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
    deadlineConstraints,
  };
}
