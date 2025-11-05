import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alerts } from "@/shared/alerts";
import { updateProfile } from "../profileService.js";
import { 
  ValidationError, 
  processFieldErrors, 
  getDisplayMessage 
} from "@/utils/errorHandler";

const useEditProfile = (onClose, profile) => {
  const [form, setForm] = useState({
    firstName: profile?.firstName || "",
    middleName: profile?.middleName || "",
    lastName: profile?.lastName || "",
    organizationName: profile?.organizationName || "",
    phoneNumber: profile?.phoneNumber || "",
    location: profile?.location || "",
    description: profile?.description || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpiar error del campo cuando el usuario empieza a escribir
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

  const handlePhoneChange = (value) => {
    // Limpiar error del campo
    if (fieldErrors.phoneNumber) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
    
    setForm({ ...form, phoneNumber: value });
  };

  const handleLocationChange = (selectedOption) => {
    if (fieldErrors.location) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
    
    setForm({ ...form, location: selectedOption.label });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});


    try {
      await updateProfile(form);


      Alerts.success("¡Perfil actualizado correctamente!");
      onClose();
      
      // Recargar la página para obtener los datos actualizados
      setTimeout(() => {
        window.location.reload();
      }, 500);

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
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit,
  };
};

export default useEditProfile;