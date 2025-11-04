import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alerts } from "@/shared/alerts";
import { putProfile } from "../profileService.js";

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handlePhoneChange = (value) => {
    console.log(value);

    setForm({ ...form, phoneNumber: value });
  };
  const handleLocationChange = (selectedOption) => {
    console.log(selectedOption);

    setForm({ ...form, location: selectedOption.label });
  };

  const validations = [
    {
      condition: !form.firstName.trim(),
      message: "El nombre es obligatorio",
    },
    {
      condition: !form.middleName.trim(),
      message: "El primer apellido es obligatorio",
    },
    {
      condition: !form.lastName.trim(),
      message: "El segundo apellido es obligatorio",
    },
    {
      condition: !form.phoneNumber.trim(),
      message: "El número de teléfono es obligatorio",
    },
    {
      condition: !form.location.trim(),
      message: "La ubicación es obligatoria",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const error = validations.find((v) => v.condition);
      if (error) {
        Alerts.error(error.message);
        return;
      }

      const response = await putProfile(form);

      if (!response.success) {
        Alerts.error(response.err || "Error en el registro");
        return;
      }

      Alerts.success("¡Registro exitoso!");
      onClose();
      navigate("/profile");
      window.location.reload();
    } catch (err) {
      Alerts.error(err.message || "Error en el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit,
  };
};

export default useEditProfile;
