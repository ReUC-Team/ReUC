import { useState, useEffect } from "react";
import { Alerts } from "@/shared/alerts";
import { updateProfile } from "../profileService.js";
import { 
  ValidationError, 
  processFieldErrors, 
  getDisplayMessage 
} from "@/utils/errorHandler";

const useEditProfile = (onClose, profile) => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    organizationName: "",
    phoneNumber: "",
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Cargar valores del perfil cuando el componente monta o profile cambia
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        middleName: profile.middleName || "",
        lastName: profile.lastName || "",
        organizationName: profile.organizationName || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
        description: profile.description || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    if (fieldErrors.phoneNumber) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
    
    setForm(prev => ({ ...prev, phoneNumber: value }));
  };

  const handleLocationChange = (selectedOption) => {
    if (fieldErrors.location) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
    
    setForm(prev => ({ ...prev, location: selectedOption.label }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      const loadingAlert = Alerts.loading("Actualizando perfil...");

      await updateProfile(form);

      loadingAlert.close();
      Alerts.success("¡Perfil actualizado correctamente!");
      
      onClose();
      
      // Recargar después de cerrar el modal
      setTimeout(() => {
        window.location.reload();
      }, 300);

    } catch (error) {
      console.error("Error updating profile:", error);

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
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit,
  };
};

export default useEditProfile;