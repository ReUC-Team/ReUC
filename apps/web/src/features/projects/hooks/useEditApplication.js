import { useState, useEffect } from "react";
import { updateApplication, approveApplication } from "../projectsService";
import { Alerts } from "@/shared/alerts";
import { ValidationError, getDisplayMessage, processFieldErrors } from "@/utils/errorHandler";

export default function useEditApplication(uuid, onEditSuccess, onApproveSuccess, projectTypes = [], applicationCreatedAt) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    projectType: [],
    faculty: [],
    problemType: [],
    problemTypeOther: "",
    deadline: "",
  });

  const [deadlineConstraints, setDeadlineConstraints] = useState({
    min: null,
    max: null,
    projectTypeName: null,
    minMonths: 0,
    maxMonths: 0,
    applicationDate: null,
  });

  // Helper para formatear fecha local sin zona horaria
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calcular constraints basados en la fecha de vigencia original
  useEffect(() => {
    if (form.projectType.length > 0 && projectTypes.length > 0 && applicationCreatedAt && form.deadline) {
      const selectedTypeId = form.projectType[0];
      const projectType = projectTypes.find(pt => pt.project_type_id === selectedTypeId);
      
      if (projectType) {
        // Fecha de solicitud (cuando se creó la Application)
        const appDateStr = applicationCreatedAt.split('T')[0];
        const [appYear, appMonth, appDay] = appDateStr.split('-').map(Number);
        const applicationDate = new Date(appYear, appMonth - 1, appDay);
        
        // Fecha mínima = fecha de vigencia original (la que seleccionó el usuario)
        const [deadlineYear, deadlineMonth, deadlineDay] = form.deadline.split('-').map(Number);
        const originalDeadline = new Date(deadlineYear, deadlineMonth - 1, deadlineDay);
        
        // Fecha máxima = fecha mínima + 1 mes de buffer
        const maxDate = new Date(originalDeadline);
        maxDate.setMonth(maxDate.getMonth() + 1);
        
        // Calcular meses entre solicitud y fecha mínima
        const minMonths = Math.round(
          (originalDeadline.getFullYear() - applicationDate.getFullYear()) * 12 +
          (originalDeadline.getMonth() - applicationDate.getMonth())
        );
        
        setDeadlineConstraints({
          min: formatDateLocal(originalDeadline),
          max: formatDateLocal(maxDate),
          projectTypeName: projectType.name,
          minMonths,
          maxMonths: minMonths + 1,
          applicationDate: formatDateLocal(applicationDate)
        });
      }
    } else {
      setDeadlineConstraints({ 
        min: null, 
        max: null, 
        projectTypeName: null,
        minMonths: 0,
        maxMonths: 0,
        applicationDate: null
      });
    }
  }, [form.projectType, form.deadline, projectTypes, applicationCreatedAt]);

  // Inicializar formulario con datos de la aplicación
  const initializeForm = (application) => {
    setForm({
      projectType: application.projectTypeIds || [],
      faculty: application.facultyIds || [],
      problemType: application.problemTypeIds || [],
      problemTypeOther: application.problemTypeOther || "",
      deadline: application.dueDate?.split('T')[0] || "",
    });
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Radio button para faculty
    if (type === "radio" && name === "faculty") {
      setForm(prevForm => ({
        ...prevForm,
        faculty: [Number(value)]
      }));
      return;
    }

    // Checkboxes (projectType, faculty, problemType)
    if (type === "checkbox") {
      if (name === "projectType" || name === "faculty" || name === "problemType") {
        setForm(prevForm => {
          const currentArray = prevForm[name] || [];
          const parsedValue = value === "otro" ? "otro" : Number(value);
          
          if (checked) {
            return {
              ...prevForm,
              [name]: [...currentArray, parsedValue]
            };
          } else {
            const newArray = currentArray.filter(item => item !== parsedValue);
            
            // Limpiar problemTypeOther si se deselecciona "otro"
            if (name === "problemType" && parsedValue === "otro") {
              return {
                ...prevForm,
                [name]: newArray,
                problemTypeOther: "",
              };
            }
            
            return {
              ...prevForm,
              [name]: newArray
            };
          }
        });
        return;
      }
    }

    // Validar fecha en tiempo real
    if (name === "deadline" && value && deadlineConstraints.min) {
      const [year, month, day] = value.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      
      const [minYear, minMonth, minDay] = deadlineConstraints.min.split('-').map(Number);
      const minDate = new Date(minYear, minMonth - 1, minDay);
      
      const [maxYear, maxMonth, maxDay] = deadlineConstraints.max.split('-').map(Number);
      const maxDate = new Date(maxYear, maxMonth - 1, maxDay);

      if (selectedDate < minDate) {
        Alerts.warning(
          `Fecha demasiado pronto. La fecha mínima es ${minDate.toLocaleDateString('es-MX', { 
            day: 'numeric',
            month: 'long', 
            year: 'numeric' 
          })}`
        );
      } else if (selectedDate > maxDate) {
        Alerts.warning(
          `Fecha demasiado lejana. La fecha máxima es ${maxDate.toLocaleDateString('es-MX', { 
            day: 'numeric',
            month: 'long', 
            year: 'numeric' 
          })}`
        );
      } else {
        Alerts.success('Fecha válida seleccionada');
      }
    }

    // Actualizar campo en el estado
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    const errors = {};

    if (form.projectType.length === 0) {
      errors.projectType = "Selecciona al menos un tipo de proyecto";
    }

    if (form.faculty.length === 0) {
      errors.faculty = "Selecciona una facultad";
    }

    if (form.problemType.length === 0) {
      errors.problemType = "Selecciona al menos un tipo de problemática";
    }

    if (form.problemType.includes("otro") && !form.problemTypeOther?.trim()) {
      errors.problemTypeOther = "Por favor describe la problemática personalizada";
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

      if (selectedDate < minDate) {
        errors.deadline = `Fecha demasiado pronto. La fecha mínima es ${minDate.toLocaleDateString('es-MX', { 
          day: 'numeric',
          month: 'long', 
          year: 'numeric' 
        })}`;
      } else if (selectedDate > maxDate) {
        errors.deadline = `Fecha demasiado lejana. La fecha máxima es ${maxDate.toLocaleDateString('es-MX', { 
          day: 'numeric',
          month: 'long', 
          year: 'numeric' 
        })} (1 mes de margen desde la fecha original)`;
      }
    }

    return errors;
  };

  // Guardar cambios sin aprobar (solo actualizar metadata)
  const handleSaveOnly = async (e, applicationData) => {
    e.preventDefault();

    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      Alerts.warning("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    try {
      const finalProblemTypes = form.problemType.filter(pt => pt !== "otro");

      let finalProblemTypeOther = undefined;
      if (form.problemType.includes("otro")) {
        const trimmed = form.problemTypeOther?.trim();
        if (trimmed) {
          finalProblemTypeOther = trimmed;
        }
      }

      const updateData = {
        title: applicationData.title,
        shortDescription: applicationData.shortDescription,
        description: applicationData.detailedDescription,
        deadline: form.deadline,
        projectType: form.projectType,
        faculty: form.faculty,
        problemType: finalProblemTypes,
      };

      if (finalProblemTypeOther !== undefined) {
        updateData.problemTypeOther = finalProblemTypeOther;
      }

      await updateApplication(uuid, updateData);

      Alerts.success("Cambios guardados exitosamente");

      if (onEditSuccess) {
        onEditSuccess();
      }

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

  // Guardar cambios y aprobar (crear proyecto)
  const handleSaveAndApprove = async (e, applicationData) => {
    e.preventDefault();

    if (form.projectType.length === 0) {
      Alerts.error("Debes seleccionar un tipo de proyecto antes de aprobar");
      setFieldErrors(prev => ({
        ...prev,
        projectType: "Selecciona un tipo de proyecto"
      }));
      return;
    }

    if (!deadlineConstraints.min) {
      Alerts.error("Espera a que se calculen las fechas permitidas. Si el problema persiste, recarga la página.");
      return;
    }

    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      if (errors.deadline) {
        Alerts.error(`Fecha inválida: ${errors.deadline}`);
      } else {
        Alerts.warning("Por favor completa todos los campos requeridos");
      }
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    try {
      const finalProblemTypes = form.problemType.filter(pt => pt !== "otro");

      let finalProblemTypeOther = undefined;
      if (form.problemType.includes("otro")) {
        const trimmed = form.problemTypeOther?.trim();
        if (trimmed) {
          finalProblemTypeOther = trimmed;
        }
      }

      const projectData = {
        title: applicationData.title,
        shortDescription: applicationData.shortDescription,
        description: applicationData.detailedDescription,
        deadline: form.deadline,
        projectType: form.projectType,
        faculty: form.faculty,
        problemType: finalProblemTypes,
      };

      if (finalProblemTypeOther !== undefined) {
        projectData.problemTypeOther = finalProblemTypeOther;
      }

      const response = await approveApplication(uuid, projectData);

      const projectUuid = response?.project?.uuid_project;

      if (!projectUuid) {
        throw new Error("No se pudo obtener el UUID del proyecto creado");
      }

      Alerts.success("Proyecto aprobado exitosamente");

      if (onApproveSuccess) {
        onApproveSuccess(projectUuid);
      }

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

  // Resetear formulario a estado inicial
  const resetForm = () => {
    setForm({
      projectType: [],
      faculty: [],
      problemType: [],
      problemTypeOther: "",
      deadline: "",
    });
    setFieldErrors({});
  };

  return {
    form,
    fieldErrors,
    isLoading,
    handleChange,
    handleSaveOnly,
    handleSaveAndApprove,
    resetForm,
    initializeForm,
    deadlineConstraints,
  };
}
