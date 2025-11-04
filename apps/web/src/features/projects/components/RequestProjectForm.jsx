import React, { useState, useRef, useEffect } from 'react'
import pdfIcon from '@/assets/icons/pdf.png'
import docIcon from '@/assets/icons/doc.png'
import zipIcon from '@/assets/icons/zip.png'
import useFormProjectMetadata from "../hooks/useFormProjectMetadata"

export default function RequestProjectForm({ form, handleChange, handleSubmit }) {
  const [showInfo, setShowInfo] = useState(false)
  const [selectedDefaultImage, setSelectedDefaultImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const fileInputRef = useRef(null)

  
  const { faculties, projectTypes, problemTypes, defaultBanners } = useFormProjectMetadata()
  const extendedProblemTypes = [...problemTypes, { problem_type_id: "otro", name: "Otro" }];
  
  
  // Función para manejar la selección de imagen predeterminada
  const handleDefaultImageSelect = (banner) => {
    setSelectedDefaultImage(banner.url)
    
    // Crear un evento sintético para simular el cambio en el formulario
    handleChange({
      target: { 
        name: 'imageDefault', 
        value: banner.url, 
        type: 'text' 
      },
    })
    
    // limpiar archivo local si existía
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFile(null);
    if (selectedFilePreview) {
      URL.revokeObjectURL(selectedFilePreview);
      setSelectedFilePreview(null);
    }
};

  // cuando seleccionan archivo desde input
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // revoke previous preview
      if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);

      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      setSelectedFilePreview(preview);

      setSelectedDefaultImage(null);
      setSelectedFile(file);

      // pasar evento al handler original para que actualice form
      handleChange(e);
    }
  };
  
  // Obtener el icono adecuado según el tipo de archivo
  const getFileIcon = (file) => {
    if (!file) return null
    
    if (file.type.startsWith('image/')) {
      return selectedFilePreview
    } else if (file.type === 'application/pdf') {
      return pdfIcon
    } else if (file.type === 'application/msword' || 
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return docIcon
    } else if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
      return zipIcon
    } else {
      // Icono genérico para otros tipos de archivos
      return null
    }
  }
  
  // Obtener el nombre corto del archivo (máx 20 caracteres)
  const getShortFileName = (file) => {
    if (!file) return ''
    
    if (file.name.length <= 20) return file.name
    
    const extension = file.name.split('.').pop()
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'))
    return baseName.substring(0, 16) + '...' + '.' + extension
  }

// limpiar preview en unmount
useEffect(() => {
  return () => {
    if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);
  };
}, [selectedFilePreview]);



  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl flex flex-col gap-8 bg-gray-50 p-10 rounded-xl shadow-lg"
    >
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div  className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Nombre del solicitante
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>
        <div className="md:col-span-2" >
          <label className="block mb-2 font-semibold text-gray-700">
            Teléfono de contacto
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="1234567890"
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Correo de contacto
          </label>
          <input
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Empresa <span className="text-sm text-gray-500">(sugerido)</span>
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Nombre de tu empresa"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
          />
        </div>
      </fieldset>

      {/* 2. Detalles del proyecto */}
      <fieldset className="flex flex-col gap-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Título del proyecto
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Título atractivo y claro"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Descripción corta
          </label>
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Resumen breve (para tarjeta)"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Descripción detallada
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe el proyecto que necesitas"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
            rows={5}
            required
          />
        </div>
      </fieldset>

      {/* 3. Selecciones */}
      <fieldset className="flex flex-col gap-6">
        {/* Tipo de proyecto */}
        <div>
          <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
            Tipo de proyecto <span className="text-sm text-gray-500">(sugerido)</span>
            <button
              type="button"
              onClick={() => setShowInfo((s) => !s)}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#4E4E4E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4m0-4h.01" />
              </svg>
            </button>
          </label>
          {showInfo && (
            <div className="mb-2 p-3 bg-green-100 border border-green-300 text-green-800 rounded text-sm">
              Selecciona la modalidad académica a la que aplica tu proyecto.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projectTypes.map(({ project_type_id, name }) => (
              <label key={project_type_id} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="projectType"
                  value={project_type_id}
                  checked={form.projectType.includes(String(project_type_id))}
                  onChange={handleChange}
                />
                <span className="text-gray-700">{name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Facultad sugerida */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Facultad sugerida <span className="text-sm text-gray-500">(sugerido)</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {faculties.map(({ faculty_id, name }) => (
              <label key={faculty_id} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="faculty"
                  value={faculty_id}
                  checked={form.faculty.includes(String(faculty_id))}
                  onChange={handleChange}
                />
                <span className="text-gray-700">{name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Tipo de problemática <span className="text-sm text-gray-500">(sugerido)</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {extendedProblemTypes.map(({ problem_type_id, name }) => (
              <label key={problem_type_id} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="problemType"
                  value={problem_type_id}
                  checked={form.problemType.includes(String(problem_type_id))}
                  onChange={handleChange}
                />
                <span className="text-gray-700">{name}</span>
              </label>
            ))}
          </div>
          {form.problemType.includes('otro') && (
            <div className="mt-3">
              <label className="block mb-2 font-semibold text-gray-700">
                ¿Cuál?
              </label>
              <input
                name="problemTypeOther"
                value={form.problemTypeOther}
                onChange={handleChange}
                placeholder="Describe tu problemática"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* 4. Vigencia y Banner */}
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div  className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">Vigencia</label>
          <input
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            type="date"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Archivo adjunto (Opcional)
          </label>
          
          {/* Mostrar la imagen seleccionada actualmente */}
          {selectedDefaultImage && (
            <div className="mb-3 flex items-center">
              <img 
                src={selectedDefaultImage} 
                alt="Banner seleccionado" 
                className="w-24 h-16 object-cover rounded-lg border-2 border-lime-600" 
              />
              <span className="ml-3 text-green-600 text-sm">
                Banner predeterminado seleccionado
              </span>
            </div>
          )}
          
          {/* Mostrar información del archivo seleccionado */}
          {selectedFile && !selectedDefaultImage && (
            <div className="mb-3 flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded">
                {getFileIcon(selectedFile) ? (
                  <img 
                    src={getFileIcon(selectedFile)} 
                    alt="Icono de archivo" 
                    className={`${selectedFile.type.startsWith('image/') ? 'h-full w-full object-cover' : 'h-8 w-8'}`}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{getShortFileName(selectedFile)}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type.split('/')[1]?.toUpperCase() || 'Archivo'}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="ml-auto text-gray-400 hover:text-red-500 hover:cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            name="file"
            onChange={handleFileInputChange}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.zip,.rar,.ppt,.pptx,.xls,.xlsx,.txt"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Puedes subir imágenes, PDFs, documentos Word, PowerPoint, Excel, archivos ZIP y otros formatos comunes.
          </p>

          <div className="mt-4">
            <p className="text-gray-700 text-sm mb-2">O selecciona una imagen predeterminada para el banner:</p>
            <div className="flex gap-4">
              {defaultBanners.map((banner, index) => (
                <div key={banner.uuid || index} className="flex flex-col items-center">
                  <img
                    src={banner.url}
                    alt={banner.originalName}
                    onClick={() => handleDefaultImageSelect(banner)}
                    className={`w-20 h-12 object-cover cursor-pointer rounded-lg border-2 transition-all ${
                      selectedDefaultImage === banner.url ? 'border-lime-600 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  />
                  <span className="text-xs mt-1 text-gray-500">
                    {selectedDefaultImage === banner.url ? 'Seleccionado' : `Opción ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end gap-4 pt-6">
        <button
          type="reset"
          className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => {
            setSelectedDefaultImage(null);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-lime-600 hover:bg-lime-700 text-white transition"
        >
          Enviar solicitud
        </button>
      </div>
    </form>
  )
}
