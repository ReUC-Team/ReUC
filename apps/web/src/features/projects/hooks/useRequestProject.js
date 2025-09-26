import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../projectsService.js";

export default function useRequestProject() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    contactEmail: "",
    company: "",
    title: "",
    shortDescription: "",
    description: "",
    deadline: "",

    // cambio de imageFile a file
    file: null,

    // --- Campos convertidos a arrays para múltiples selecciones ---
    projectType: [],
    faculty: [],
    problemType: [],
    // form.projectType.join(',')

    // --- Campos nuevos ---
    problemTypeOther: "", // para descripción cuando "otro" está seleccionado
    imageDefault: "", // para banner/miniatura por defecto
    fileName: "", // para nombre del archivo subido
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Si el evento es sintético (creado por nosotros para las imágenes predeterminadas)
    if (!e.target.type && e.target.name === "imageDefault") {
      setForm((prev) => ({
        ...prev,
        imageDefault: e.target.value,
        imageFile: null, // Con esto limpiamos cualquier archivo seleccionado anteriormente
      }));
      return;
    }

    const { name, value, type, files, checked } = e.target;

    if (type === "checkbox" && Array.isArray(form[name])) {
      setForm((prev) => {
        const prevArr = prev[name];
        return {
          ...prev,
          [name]: checked
            ? [...prevArr, value]
            : prevArr.filter((v) => v !== value),
        };
      });
      return;
    }

    // Archivo subido
    if (type === "file") {
      if (files && files.length > 0) {
        setForm((prev) => ({
          ...prev,
          file: files[0],
          fileName: files[0].name,
          imageDefault: "", // Se limpia cualquier imagen predeterminada seleccionada
        }));
      }
      return;
    }

    // Selección de miniatura por defecto (simulate file selection)
    if (name === "imageDefault") {
      setForm((prev) => ({
        ...prev,
        imageDefault: value,
        imageFile: null,
      }));
      return;
    }

    // Campos de texto / date / selects
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name) {
      setError("Debes poner nombre del solicitante del proyecto");
      // setIsLoading(false);
      return;
    }
    if (!form.company) {
      setError("El nombre de la compañía es obligatorio.");
      return;
    }
    if (!form.title) {
      setError("El título del proyecto es obligatorio.");
      return;
    }
    if (form.projectType.length === 0) {
      setError("Selecciona al menos un tipo de proyecto.");
      return;
    }
    if (form.faculty.length === 0) {
      setError("Selecciona al menos una facultad.");
      return;
    }
    if (form.problemType.length === 0) {
      setError("Selecciona al menos un tipo de problemática.");
      return;
    }
    if (form.problemType.includes("otro") && !form.problemTypeOther) {
      setError("Describe la problemática en 'Otro'.");
      return;
    }
    if (!form.deadline) {
      setError("Debes indicar la vigencia.");
      return;
    }
    if (!form.phone && !form.contactEmail) {
      setError("Debe haber al menos un medio de contacto (teléfono o email).");
      return;
    }
    if (!form.shortDescription && !form.description) {
      setError("Debe haber al menos una descripción.");
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => payload.append(key, v));
      } else if (val instanceof File) {
        payload.append(key, val); // actual uploaded file
      } else if (val !== null && val !== undefined) {
        payload.append(key, val);
      }
    });

    try {
      const response = await createApplication(payload);
      if (!response.success) {
        if (response.logout) navigate("/");
        setError(response.err || "Error en el registro");
        return;
      }
      navigate("/explore-projects/project-details");
    } catch (err) {
      setError(err.message || "Algo salió mal");
    }
  };

  return { form, error, handleChange, handleSubmit };
}
