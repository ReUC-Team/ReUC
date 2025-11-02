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
    phoneNumber: profile?.phoneNumber || "",
    location: profile?.location || "",
    description: profile?.description || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

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

  const handlePhoneChange = (value) => {
    setForm({ ...form, phoneNumber: value });
  };

  const handleLocationChange = (selectedOption) => {
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
      navigate("/profile");
      window.location.reload();

    } catch (error) {
      console.error("Edit profile error:", error);

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