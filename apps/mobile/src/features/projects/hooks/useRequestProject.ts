import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { create } from '../services/projectsService';

interface FormState {
  name: string;
  phone: string;
  contactEmail: string;
  company: string;
  title: string;
  shortDescription: string;
  description: string;
  deadline: string;
  file: any;
  projectType: string[];
  faculty: string[];
  problemType: string[];
  problemTypeOther: string;
  imageDefault: string;
  fileName: string;
}

export default function useRequestProject() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    contactEmail: '',
    company: '',
    title: '',
    shortDescription: '',
    description: '',
    deadline: '',
    file: null,
    projectType: [],
    faculty: [],
    problemType: [],
    problemTypeOther: '',
    imageDefault: '',
    fileName: '',
  });

  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validaciones
    if (!form.name) {
      setError('Debes poner nombre del solicitante del proyecto');
      return;
    }
    if (!form.company) {
      setError('El nombre de la compañía es obligatorio.');
      return;
    }
    if (!form.title) {
      setError('El título del proyecto es obligatorio.');
      return;
    }
    if (form.projectType.length === 0) {
      setError('Selecciona al menos un tipo de proyecto.');
      return;
    }
    if (form.faculty.length === 0) {
      setError('Selecciona al menos una facultad.');
      return;
    }
    if (form.problemType.length === 0) {
      setError('Selecciona al menos un tipo de problemática.');
      return;
    }
    if (form.problemType.includes('otro') && !form.problemTypeOther) {
      setError("Describe la problemática en 'Otro'.");
      return;
    }
    if (!form.deadline) {
      setError('Debes indicar la vigencia.');
      return;
    }
    if (!form.phone && !form.contactEmail) {
      setError('Debe haber al menos un medio de contacto (teléfono o email).');
      return;
    }
    if (!form.shortDescription && !form.description) {
      setError('Debe haber al menos una descripción.');
      return;
    }

    try {
      const response = await create(form);
      if (!response.success) {
        if (response.logout) navigation.navigate('Landing');

        setError(response.err || 'Error en el registro');
        return;
      }
      navigation.navigate('ProjectDetails');
    } catch (error: any) {
      setError(error.message || 'Algo salió mal');
    }
  };

  return { form, error, handleChange, handleSubmit };
}