import { useState } from "react";
import { approveApplication } from "../projectsService";
import { Alerts } from "@/shared/alerts";
import { ValidationError, getDisplayMessage, processFieldErrors } from "@/utils/errorHandler";

/**
 * Hook para editar metadata y aprobar una aplicación
 * @param {string} uuid - UUID de la aplicación
 * @param {Function} onSuccess - Callback al aprobar exitosamente
 * @returns {Object} - { form, fieldErrors, isLoading, handleChange, handleSubmit, resetForm, initializeForm }
 */
export default function useEditApplication(uuid, onSuccess) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    projectType: [],
    faculty: [],
    problemType: [],
    problemTypeOther: "",
    deadline: "",
    editReason: "", // TODO: Campo placeholder (no funcional aún)
  });

  /**
   * Inicializa el formulario con datos existentes de la aplicación
   * @param {Object} application - Datos de la aplicación
   */
  const initializeForm = (application) => {
    setForm({
      projectType: application.projectTypeIds || [],
      faculty: application.facultyIds || [],
      problemType: application.problemTypeIds || [],
      problemTypeOther: "",
      deadline: application.dueDate?.split('T')[0] || "",
      editReason: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpiar error del campo
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Manejo de checkboxes
    if (type === "checkbox") {
      if (name === "projectType" || name === "faculty" || name === "problemType") {
        setForm(prevForm => {
          const currentArray = prevForm[name] || [];
          
          // Manejar "otro" como string, resto como números
          const parsedValue = value === "otro" ? "otro" : Number(value);
          
          if (checked) {
            return {
              ...prevForm,
              [name]: [...currentArray, parsedValue]
            };
          } else {
            // ✅ Si se desmarca "otro", limpiar problemTypeOther
            const newArray = currentArray.filter(item => item !== parsedValue);
            
            if (name === "problemType" && parsedValue === "otro") {
              return {
                ...prevForm,
                [name]: newArray,
                problemTypeOther: "", // ✅ Limpiar campo de texto
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

    // Campos de texto normales
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (form.projectType.length === 0) {
      errors.projectType = "Selecciona al menos un tipo de proyecto";
    }

    if (form.faculty.length === 0) {
      errors.faculty = "Selecciona al menos una facultad";
    }

    if (form.problemType.length === 0) {
      errors.problemType = "Selecciona al menos un tipo de problemática";
    }

    // ✅ Validar que si "otro" está marcado, debe tener texto
    if (form.problemType.includes("otro") && !form.problemTypeOther?.trim()) {
      errors.problemTypeOther = "Por favor describe la problemática personalizada";
    }

    if (!form.deadline) {
      errors.deadline = "La vigencia es requerida";
    }

    // TODO: Validación de editReason desactivada temporalmente
    // if (!form.editReason?.trim()) {
    //   errors.editReason = "Por favor explica la razón de la edición";
    // }

    return errors;
  };

// Línea 127-195: REEMPLAZAR handleSubmit

const handleSubmit = async (e, applicationData) => {
  e.preventDefault();

  // Validar formulario
  const errors = validateForm();
  
  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    Alerts.warning("Por favor completa todos los campos requeridos");
    return;
  }

  setIsLoading(true);
  setFieldErrors({});

  try {
    // ✅ Filtrar "otro" de problemType antes de enviar
    const finalProblemTypes = form.problemType.filter(pt => pt !== "otro");

    // ✅ Preparar problemTypeOther correctamente
    let finalProblemTypeOther = undefined;
    if (form.problemType.includes("otro")) {
      const trimmed = form.problemTypeOther?.trim();
      if (trimmed) {
        finalProblemTypeOther = trimmed;
      }
    }

    // ✅ Usar datos del formulario (editados)
    const projectData = {
      title: applicationData.title,
      shortDescription: applicationData.shortDescription,
      description: applicationData.detailedDescription,
      estimatedDate: form.deadline,           // ✅ Dato editado
      projectType: form.projectType,          // ✅ IDs editados
      faculty: form.faculty,                  // ✅ IDs editados
      problemType: finalProblemTypes,         // ✅ IDs editados (sin "otro")
    };

    // ✅ Solo agregar problemTypeOther si tiene valor
    if (finalProblemTypeOther !== undefined) {
      projectData.problemTypeOther = finalProblemTypeOther;
    }

    console.log("📤 Enviando proyecto con datos EDITADOS:", projectData);

    // ✅ CORRECCIÓN: Capturar respuesta del backend
    const response = await approveApplication(uuid, projectData);
    
    console.log("✅ Respuesta del backend:", response);

    // ✅ Extraer UUID del proyecto creado
    const projectUuid = response?.project?.uuid_project;

    if (!projectUuid) {
      console.error("❌ Backend no retornó uuid_project:", response);
      throw new Error("No se pudo obtener el UUID del proyecto creado");
    }

    // ✅ Pasar UUID al callback de éxito
    if (onSuccess) {
      onSuccess(projectUuid); // ✅ Pasar UUID del proyecto
    }

  } catch (error) {
    console.error("Error al aprobar proyecto:", error);

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

  const resetForm = () => {
    setForm({
      projectType: [],
      faculty: [],
      problemType: [],
      problemTypeOther: "",
      deadline: "",
      editReason: "",
    });
    setFieldErrors({});
  };

  return {
    form,
    fieldErrors,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
    initializeForm,
  };
}