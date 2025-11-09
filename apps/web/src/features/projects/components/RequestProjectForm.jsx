import React, { useState, useRef, useEffect } from 'react'
import pdfIcon from '@/assets/icons/pdf.svg'
import docIcon from '@/assets/icons/doc.svg'
import zipIcon from '@/assets/icons/zip.svg'
import excelIcon from '@/assets/icons/excel.svg'           
import powerpointIcon from '@/assets/icons/powerpoint.svg' 
import imageIcon from '@/assets/icons/image.svg'           
import videoIcon from '@/assets/icons/video.svg'           
import audioIcon from '@/assets/icons/audio.svg'           
import textIcon from '@/assets/icons/text.svg'             
import fileIcon from '@/assets/icons/file.svg'           
import useFormProjectMetadata from "../hooks/useFormProjectMetadata"

export default function RequestProjectForm({ 
  form, 
  fieldErrors, 
  isLoading, 
  handleChange, 
  handleBannerSelection,
  handleRemoveAttachment,
  handleSubmit 
}) {
  const [showInfo, setShowInfo] = useState(false)
  const bannerInputRef = useRef(null)
  const attachmentsInputRef = useRef(null)

  const { faculties, projectTypes, problemTypes, defaultBanners } = useFormProjectMetadata()
  const extendedProblemTypes = [...problemTypes, { problem_type_id: "otro", name: "Otro" }]

  // Usar el estado del hook padre (form.customBannerFile, form.attachments)
  const customBannerPreview = form.customBannerFile 
    ? URL.createObjectURL(form.customBannerFile) 
    : null;

  // ========== BANNER HANDLERS ==========
  const handleDefaultBannerSelect = (banner) => {
    // Limpiar banner custom
    if (bannerInputRef.current) bannerInputRef.current.value = ""
    
    // Usar handleBannerSelection del hook
    handleBannerSelection(banner.uuid)
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

      // Pasar al hook usando handleChange
      handleChange({
        target: { 
          name: "customBannerFile", 
          files: [file],
          type: "file"
        }
      })
    }
  }

  // ========== ATTACHMENTS HANDLERS ==========
  const handleAttachmentsChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const currentFiles = form.attachments || []
      
      // Combinar archivos existentes con nuevos
      const combinedFiles = [...currentFiles, ...newFiles]
      
      // Validar cantidad total (máx 5)
      if (combinedFiles.length > 5) {
        alert(`Solo puedes adjuntar máximo 5 archivos. Actualmente tienes ${currentFiles.length} archivo(s). Puedes agregar ${5 - currentFiles.length} más.`)
        e.target.value = ''
        return
      }

      // Pasar al hook usando handleChange
      handleChange({
        target: {
          name: "attachments",
          files: combinedFiles, // ← Enviar archivos combinados
          type: "file"
        }
      })
      
      // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
      e.target.value = ''
    }
  }

  const removeAttachment = (index) => {
    // Usar handleRemoveAttachment del hook
    handleRemoveAttachment(index)
    
    // Limpiar el input file después de remover
    if (attachmentsInputRef.current) {
      attachmentsInputRef.current.value = ''
    }
  }

  // ========== HELPERS ==========
const getFileIcon = (file) => {
  const mimeType = file.type
  
  // Imágenes (mostrar preview)
  if (mimeType.startsWith('image/')) return URL.createObjectURL(file)
  
  // PDF
  if (mimeType === 'application/pdf') return pdfIcon
  
  // Word
  if (mimeType.includes('word') || mimeType.includes('document')) return docIcon
  
  // Excel
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return excelIcon
  
  // PowerPoint
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return powerpointIcon
  
  // ZIP/RAR
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return zipIcon
  
  // Video
  if (mimeType.startsWith('video/')) return videoIcon
  
  // Audio
  if (mimeType.startsWith('audio/')) return audioIcon
  
  // Texto
  if (mimeType.startsWith('text/')) return textIcon
  
  // Por defecto
  return fileIcon
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
      form.attachments?.forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [customBannerPreview, form.attachments])

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
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
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
            <p className="mt-1 text-sm text-red-600">{fieldErrors.shortDescription}</p>
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
            <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
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
            <p className="mt-1 text-sm text-red-600">{fieldErrors.deadline}</p>
          )}
        </div>
      </fieldset>

      {/* 4. Banner (custom o default) */}
      <fieldset className="flex flex-col gap-4">
        <label className="block font-semibold text-gray-700">
          Banner del proyecto <span className="text-sm text-gray-500">(Selecciona uno predeterminado o sube una imagen)</span>
        </label>

        {/* Preview del banner custom */}
        {form.customBannerFile && customBannerPreview && (
          <div className="relative w-full h-40 border-2 border-lime-600 rounded-lg overflow-hidden">
            <img src={customBannerPreview} alt="Banner custom" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                if (bannerInputRef.current) bannerInputRef.current.value = ''
                handleChange({
                  target: { name: "customBannerFile", value: null, type: "file" }
                })
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
            fieldErrors?.banner ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors?.banner && (
          <p className="text-sm text-red-600">{fieldErrors.banner}</p>
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
                    form.selectedBannerUuid === banner.uuid 
                      ? 'border-lime-600 shadow-md' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                />
                <span className="text-xs mt-1 text-gray-500">
                  {form.selectedBannerUuid === banner.uuid ? '✓ Seleccionado' : banner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      {/* 5. Archivos adjuntos (múltiples) */}
      <fieldset className="flex flex-col gap-4">
        <label className="block font-semibold text-gray-700">
          Archivos adjuntos <span className="text-sm text-gray-500">(Opcional, máximo 5 archivos)</span>
        </label>

        {/* Indicador de archivos adjuntados */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-sm text-gray-700">
            Archivos adjuntados: <strong>{form.attachments?.length || 0} / 5</strong>
          </span>
          {form.attachments && form.attachments.length > 0 && (
            <span className="text-xs text-lime-600 font-medium">
              Puedes agregar {5 - form.attachments.length} más
            </span>
          )}
        </div>

        {/* Lista de attachments */}
        {form.attachments && form.attachments.length > 0 && (
          <div className="space-y-2">
            {form.attachments.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded">
                  {(() => {
                    const icon = getFileIcon(file);
                    const isImage = file.type.startsWith('image/');
                    
                    return icon ? (
                      <img 
                        src={icon} 
                        alt={file.name}
                        className={isImage ? 'h-full w-full object-cover rounded' : 'h-8 w-8 object-contain'}
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    );
                  })()}
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
          accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain,video/*,audio/*"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 ${
            fieldErrors?.attachments ? 'border-red-500' : 'border-gray-300'
          }`}
            disabled={form.attachments?.length >= 5} // Deshabilitar si ya hay 5 archivos
        />
        <p className="text-sm text-gray-500">
          Formatos permitidos: Imágenes, PDF, Word, PowerPoint, Excel, ZIP, TXT
        </p>
        {fieldErrors?.attachments && (
          <p className="text-sm text-red-600">{fieldErrors.attachments}</p>
        )}
      </fieldset>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="reset"
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          onClick={() => {
            // Limpiar inputs
            if (bannerInputRef.current) bannerInputRef.current.value = ''
            if (attachmentsInputRef.current) attachmentsInputRef.current.value = ''
          }}
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-lime-600 hover:bg-lime-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isLoading ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </div>
    </form>
  )
}