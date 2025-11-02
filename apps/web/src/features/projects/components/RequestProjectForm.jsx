import React, { useState, useRef, useEffect } from 'react'
import pdfIcon from '@/assets/icons/pdf.png'
import docIcon from '@/assets/icons/doc.png'
import zipIcon from '@/assets/icons/zip.png'
import useFormProjectMetadata from "../hooks/useFormProjectMetadata"

export default function RequestProjectForm({ form, fieldErrors, handleChange, handleSubmit }) {
  const [showInfo, setShowInfo] = useState(false)
  
  // Estados para banner
  const [selectedDefaultBannerUuid, setSelectedDefaultBannerUuid] = useState(null)
  const [customBannerFile, setCustomBannerFile] = useState(null)
  const [customBannerPreview, setCustomBannerPreview] = useState(null)
  const bannerInputRef = useRef(null)
  
  // Estados para attachments
  const [attachments, setAttachments] = useState([])
  const attachmentsInputRef = useRef(null)

  const { faculties, projectTypes, problemTypes, defaultBanners } = useFormProjectMetadata()
  const extendedProblemTypes = [...problemTypes, { problem_type_id: "otro", name: "Otro" }]

  // ========== BANNER HANDLERS ==========
  const handleDefaultBannerSelect = (banner) => {
    // Limpiar banner custom
    if (bannerInputRef.current) bannerInputRef.current.value = ""
    if (customBannerPreview) URL.revokeObjectURL(customBannerPreview)
    setCustomBannerFile(null)
    setCustomBannerPreview(null)

    // Guardar UUID del banner default
    setSelectedDefaultBannerUuid(banner.uuid)
    handleChange({
      target: { name: "selectedBannerUuid", value: banner.uuid, type: "text" }
    })
  }

  const handleCustomBannerChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Validar tipo (solo imágenes)
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes para el banner (JPEG, PNG, WebP)')
        e.target.value = ''
        return
      }

      // Limpiar banner default
      setSelectedDefaultBannerUuid(null)
      handleChange({
        target: { name: "selectedBannerUuid", value: "", type: "text" }
      })

      // Limpiar preview anterior
      if (customBannerPreview) URL.revokeObjectURL(customBannerPreview)

      // Crear preview
      const preview = URL.createObjectURL(file)
      setCustomBannerPreview(preview)
      setCustomBannerFile(file)
    }
  }

  // ========== ATTACHMENTS HANDLERS ==========
  const handleAttachmentsChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      // Validar cantidad (máx 5)
      if (files.length > 5) {
        alert('Máximo 5 archivos adjuntos permitidos')
        e.target.value = ''
        return
      }

      setAttachments(files)
    }
  }

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    setAttachments(newAttachments)
    
    // Actualizar el input file
    if (attachmentsInputRef.current) {
      const dt = new DataTransfer()
      newAttachments.forEach(file => dt.items.add(file))
      attachmentsInputRef.current.files = dt.files
    }
  }

  // ========== HELPERS ==========
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return URL.createObjectURL(file)
    if (file.type === 'application/pdf') return pdfIcon
    if (file.type.includes('word') || file.type.includes('document')) return docIcon
    if (file.type.includes('zip')) return zipIcon
    return null
  }

  const getShortFileName = (file) => {
    if (file.name.length <= 25) return file.name
    const ext = file.name.split('.').pop()
    const base = file.name.substring(0, file.name.lastIndexOf('.'))
    return base.substring(0, 20) + '...' + '.' + ext
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Limpiar previews en unmount
  useEffect(() => {
    return () => {
      if (customBannerPreview) URL.revokeObjectURL(customBannerPreview)
      attachments.forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [customBannerPreview, attachments])

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl flex flex-col gap-8 bg-gray-50 p-10 rounded-xl shadow-lg"
    >
      {/* 1. Detalles del proyecto */}
      <fieldset className="flex flex-col gap-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Título del proyecto *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Título atractivo y claro"
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 ${
              fieldErrors?.title ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors?.title && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Descripción corta *
          </label>
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Resumen breve (para tarjeta)"
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 ${
              fieldErrors?.shortDescription ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors?.shortDescription && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.shortDescription.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Descripción detallada *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe el proyecto que necesitas"
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 ${
              fieldErrors?.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={5}
            required
          />
          {fieldErrors?.description && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.description.message}</p>
          )}
        </div>
      </fieldset>

      {/* 2. Selecciones */}
      <fieldset className="flex flex-col gap-6">
        {/* Tipo de proyecto */}
        <div>
          <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
            Tipo de proyecto <span className="text-sm text-gray-500">(opcional)</span>
            <button
              type="button"
              onClick={() => setShowInfo((s) => !s)}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#4E4E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
            Facultad sugerida <span className="text-sm text-gray-500">(opcional)</span>
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
            Tipo de problemática <span className="text-sm text-gray-500">(opcional)</span>
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
              <label className="block mb-2 font-semibold text-gray-700">¿Cuál?</label>
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

      {/* 3. Vigencia */}
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">Vigencia *</label>
          <input
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            type="date"
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 ${
              fieldErrors?.deadline ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {fieldErrors?.deadline && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.deadline.message}</p>
          )}
        </div>
      </fieldset>

      {/* 4. Banner (custom o default) */}
      <fieldset className="flex flex-col gap-4">
        <label className="block font-semibold text-gray-700">
          Banner del proyecto <span className="text-sm text-gray-500">(Selecciona uno predeterminado o sube una imagen)</span>
        </label>

        {/* Preview del banner custom */}
        {customBannerFile && customBannerPreview && (
          <div className="relative w-full h-40 border-2 border-lime-600 rounded-lg overflow-hidden">
            <img src={customBannerPreview} alt="Banner custom" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                if (bannerInputRef.current) bannerInputRef.current.value = ''
                if (customBannerPreview) URL.revokeObjectURL(customBannerPreview)
                setCustomBannerFile(null)
                setCustomBannerPreview(null)
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Input de banner custom */}
        <input
          ref={bannerInputRef}
          name="customBannerFile"
          onChange={handleCustomBannerChange}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 ${
            fieldErrors?.customBannerFile || fieldErrors?.selectedBannerUuid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {(fieldErrors?.customBannerFile || fieldErrors?.selectedBannerUuid) && (
          <p className="text-sm text-red-600">
            {fieldErrors?.customBannerFile?.message || fieldErrors?.selectedBannerUuid?.message}
          </p>
        )}

        {/* Banners predeterminados */}
        <div className="mt-2">
          <p className="text-gray-700 text-sm mb-2">O selecciona un banner predeterminado:</p>
          <div className="flex gap-4 flex-wrap">
            {defaultBanners.map((banner) => (
              <div key={banner.uuid} className="flex flex-col items-center">
                <img
                  src={banner.url}
                  alt={banner.name}
                  onClick={() => handleDefaultBannerSelect(banner)}
                  className={`w-24 h-16 object-cover cursor-pointer rounded-lg border-2 transition-all ${
                    selectedDefaultBannerUuid === banner.uuid 
                      ? 'border-lime-600 shadow-md' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                />
                <span className="text-xs mt-1 text-gray-500">
                  {selectedDefaultBannerUuid === banner.uuid ? '✓ Seleccionado' : banner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden input para UUID del banner default */}
        <input type="hidden" name="selectedBannerUuid" value={selectedDefaultBannerUuid || ''} />
      </fieldset>

      {/* 5. Archivos adjuntos (múltiples) */}
      <fieldset className="flex flex-col gap-4">
        <label className="block font-semibold text-gray-700">
          Archivos adjuntos <span className="text-sm text-gray-500">(Opcional, máximo 5 archivos)</span>
        </label>

        {/* Lista de attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded">
                  {getFileIcon(file) ? (
                    <img 
                      src={getFileIcon(file)} 
                      alt="Icono" 
                      className={`${file.type.startsWith('image/') ? 'h-full w-full object-cover rounded' : 'h-8 w-8'}`}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{getShortFileName(file)}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeAttachment(index)}
                  className="ml-auto text-gray-400 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input de attachments */}
        <input
          ref={attachmentsInputRef}
          name="attachments"
          onChange={handleAttachmentsChange}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 ${
            fieldErrors?.attachments ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className="text-sm text-gray-500">
          Formatos permitidos: Imágenes, PDF, Word, PowerPoint, Excel, ZIP, TXT
        </p>
        {fieldErrors?.attachments && (
          <p className="text-sm text-red-600">{fieldErrors.attachments.message}</p>
        )}
      </fieldset>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="reset"
          className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => {
            // Limpiar banner
            setSelectedDefaultBannerUuid(null)
            setCustomBannerFile(null)
            if (customBannerPreview) URL.revokeObjectURL(customBannerPreview)
            setCustomBannerPreview(null)
            if (bannerInputRef.current) bannerInputRef.current.value = ''

            // Limpiar attachments
            setAttachments([])
            if (attachmentsInputRef.current) attachmentsInputRef.current.value = ''
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