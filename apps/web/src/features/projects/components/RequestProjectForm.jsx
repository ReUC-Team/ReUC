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
import { formatDateStringSpanish } from '@/utils/dateUtils'

export default function RequestProjectForm({ 
  form, 
  fieldErrors, 
  isLoading, 
  handleChange, 
  handleBannerSelection,
  handleRemoveAttachment,
  handleSubmit,
  deadlineConstraints
}) {
  const [showInfo, setShowInfo] = useState(false)
  const bannerInputRef = useRef(null)
  const attachmentsInputRef = useRef(null)

  const { faculties, projectTypes, problemTypes, defaultBanners } = useFormProjectMetadata()
  const extendedProblemTypes = [...problemTypes, { problem_type_id: "otro", name: "Otro" }]

  const customBannerPreview = form.customBannerFile 
    ? URL.createObjectURL(form.customBannerFile) 
    : null;

  const handleDefaultBannerSelect = (banner) => {
    if (bannerInputRef.current) bannerInputRef.current.value = ""
    handleBannerSelection(banner.uuid)
  }

  const handleCustomBannerChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes para el banner (JPEG, PNG, WebP)')
        e.target.value = ''
        return
      }

      handleChange({
        target: { 
          name: "customBannerFile", 
          files: [file],
          type: "file"
        }
      })
    }
  }

  const handleAttachmentsChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const currentFiles = form.attachments || []
      const combinedFiles = [...currentFiles, ...newFiles]
      
      if (combinedFiles.length > 5) {
        alert(`Solo puedes adjuntar máximo 5 archivos. Actualmente tienes ${currentFiles.length} archivo(s). Puedes agregar ${5 - currentFiles.length} más.`)
        e.target.value = ''
        return
      }

      handleChange({
        target: {
          name: "attachments",
          files: combinedFiles,
          type: "file"
        }
      })
      
      e.target.value = ''
    }
  }

  const removeAttachment = (index) => {
    handleRemoveAttachment(index)
    if (attachmentsInputRef.current) {
      attachmentsInputRef.current.value = ''
    }
  }

  const getFileIcon = (file) => {
    const mimeType = file.type
    if (mimeType.startsWith('image/')) return URL.createObjectURL(file)
    if (mimeType === 'application/pdf') return pdfIcon
    if (mimeType.includes('word') || mimeType.includes('document')) return docIcon
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return excelIcon
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return powerpointIcon
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return zipIcon
    if (mimeType.startsWith('video/')) return videoIcon
    if (mimeType.startsWith('audio/')) return audioIcon
    if (mimeType.startsWith('text/')) return textIcon
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
      className="w-full max-w-5xl mx-auto"
    >
      {/* Información Básica */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Información <span className='text-lime-700'>Básica</span></h3>
            <p className="text-sm text-gray-500">Describe tu proyecto de manera clara y concisa</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del proyecto <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Sistema de gestión de inventario"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                fieldErrors?.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              required
            />
            {fieldErrors?.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción corta <span className="text-red-500">*</span>
            </label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Resumen en una línea para la tarjeta del proyecto"
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                fieldErrors?.shortDescription ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              required
            />
            {fieldErrors?.shortDescription && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.shortDescription}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción detallada <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe el problema a resolver, objetivos, alcance y cualquier detalle relevante..."
              className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none ${
                fieldErrors?.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              rows={6}
              required
            />
            {fieldErrors?.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clasificación del Proyecto */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Clasificación</h3>
            <p className="text-sm text-gray-500">Categoriza tu proyecto <span className="text-lime-600">(opcional)</span></p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tipo de proyecto */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-semibold text-gray-700">
                Tipo de proyecto
              </label>
              <button
                type="button"
                onClick={() => setShowInfo((s) => !s)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            {showInfo && (
              <div className="mb-4 p-4 bg-lime-50 border border-lime-200 rounded-xl">
                <p className="text-sm text-lime-800">
                  Selecciona la modalidad académica a la que aplica tu proyecto.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectTypes.map(({ project_type_id, name }) => (
                <label 
                  key={project_type_id} 
                  className="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md group"
                  style={{
                    borderColor: form.projectType.includes(String(project_type_id)) ? '#65a30d' : '#e5e7eb',
                    backgroundColor: form.projectType.includes(String(project_type_id)) ? '#f7fee7' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    name="projectType"
                    value={project_type_id}
                    checked={form.projectType.includes(String(project_type_id))}
                    onChange={handleChange}
                    className="w-5 h-5 text-lime-600 rounded border-gray-300 focus:ring-lime-500"
                    style={{ accentColor: '#65a30d' }}
                  />
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                  {form.projectType.includes(String(project_type_id)) && (
                    <svg className="w-5 h-5 text-lime-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Facultad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Facultad sugerida
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faculties.map(({ faculty_id, name }) => (
                <label 
                  key={faculty_id} 
                  className="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: form.faculty.includes(String(faculty_id)) ? '#65a30d' : '#e5e7eb',
                    backgroundColor: form.faculty.includes(String(faculty_id)) ? '#f7fee7' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="faculty"
                    value={faculty_id}
                    checked={form.faculty.includes(String(faculty_id))}
                    onChange={handleChange}
                    className="w-5 h-5 text-lime-600 border-gray-300 focus:ring-lime-500"
                    style={{ accentColor: '#65a30d' }}
                  />
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                  {form.faculty.includes(String(faculty_id)) && (
                    <svg className="w-5 h-5 text-lime-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de problemática */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de problemática
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {extendedProblemTypes.map(({ problem_type_id, name }) => (
                <label 
                  key={problem_type_id}
                  className="relative flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: form.problemType.includes(String(problem_type_id)) ? '#65a30d' : '#e5e7eb',
                    backgroundColor: form.problemType.includes(String(problem_type_id)) ? '#f7fee7' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    name="problemType"
                    value={problem_type_id}
                    checked={form.problemType.includes(String(problem_type_id))}
                    onChange={handleChange}
                    className="w-4 h-4 text-lime-600 rounded border-gray-300 focus:ring-lime-500"
                    style={{ accentColor: '#65a30d' }}
                  />
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                </label>
              ))}
            </div>
            
            {form.problemType.includes('otro') && (
              <div className="mt-4">
                <input
                  name="problemTypeOther"
                  value={form.problemTypeOther}
                  onChange={handleChange}
                  placeholder="Describe tu problemática..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vigencia */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Fecha<span className="text-lime-700"> Límite</span></h3>
            <p className="text-sm text-gray-500">¿Cuándo necesitas completar el proyecto?</p>
          </div>
        </div>

        {deadlineConstraints.projectTypeName ? (
          <div className="mb-4 p-5 bg-gradient-to-br from-lime-50 to-lime-50 border border-lime-200 rounded-xl">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lime-700 mb-2">{deadlineConstraints.projectTypeName}</h4>
                <div className="space-y-1.5 text-sm text-lime-800">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Inicio:</strong> {formatDateStringSpanish(deadlineConstraints.min)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Límite:</strong> {formatDateStringSpanish(deadlineConstraints.max)}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-lime-200">
                    <span className="text-xs font-semibold">Duración: {deadlineConstraints.minMonths} a {deadlineConstraints.maxMonths} meses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              Selecciona un tipo de proyecto para ver el rango de fechas permitidas
            </p>
          </div>
        )}

        <input
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          type="date"
          min={deadlineConstraints.min || undefined}
          max={deadlineConstraints.max || undefined}
          disabled={!deadlineConstraints.min}
          className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
            fieldErrors?.deadline
              ? 'border-red-300 bg-red-50'
              : !deadlineConstraints.min
              ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          required
        />

        {fieldErrors?.deadline && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{fieldErrors.deadline}</p>
          </div>
        )}

        {!fieldErrors?.deadline && form.deadline && deadlineConstraints.min && (
          <div className="mt-3 p-3 bg-lime-50 border border-lime-200 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-lime-700 font-medium">Fecha válida seleccionada</p>
          </div>
        )}
      </div>

      {/* Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Banner del <span className="font-semibold text-lime-700">Proyecto</span></h3>
            <p className="text-sm text-gray-500">Imagen principal que representará tu proyecto</p>
          </div>
        </div>

        {form.customBannerFile && customBannerPreview && (
          <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden border-2 border-lime-500 shadow-lg group">
            <img 
              src={customBannerPreview} 
              alt="Banner personalizado" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Error loading custom banner preview');
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (bannerInputRef.current) bannerInputRef.current.value = ''
                handleChange({
                  target: { name: "customBannerFile", value: null, type: "file" }
                })
              }}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subir imagen personalizada
            </label>
            <input
              ref={bannerInputRef}
              name="customBannerFile"
              onChange={handleCustomBannerChange}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-8 text-center hover:border-lime-500 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
            />
            {fieldErrors?.banner && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.banner}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">O selecciona un banner predeterminado:</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {defaultBanners.map((banner) => (
                <div
                  key={banner.uuid}
                  onClick={() => handleDefaultBannerSelect(banner)}
                  className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                    form.selectedBannerUuid === banner.uuid
                      ? 'border-lime-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-lime-300 hover:shadow-md'
                  }`}
                >
                  <img
                    src={banner.url}
                    alt={banner.name}
                    className="w-full h-full object-cover"
                  />
                  {form.selectedBannerUuid === banner.uuid && (
                    <div className="absolute inset-0 bg-lime-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1">
                        <svg className="w-6 h-6 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Archivos Adjuntos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Archivos <span className="font-semibold text-lime-700">Adjuntos</span></h3>
              <p className="text-sm text-gray-500">Documentos de apoyo <span className="font-semibold text-lime-600">(máximo 5 archivos)</span></p>
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm font-bold text-gray-700">
              {form.attachments?.length || 0} / 5
            </span>
          </div>
        </div>

        {form.attachments && form.attachments.length > 0 && (
          <div className="space-y-3 mb-4">
            {form.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  {(() => {
                    const icon = getFileIcon(file);
                    const isImage = file.type.startsWith('image/');
                    return icon ? (
                      <img 
                        src={icon} 
                        alt={file.name}
                        className={isImage ? 'w-full h-full object-cover rounded-lg' : 'w-8 h-8 object-contain'}
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{getShortFileName(file)}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={attachmentsInputRef}
          name="attachments"
          onChange={handleAttachmentsChange}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain,video/*,audio/*"
          className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-8 text-center hover:border-lime-500 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={form.attachments?.length >= 5}
        />
        <p className="mt-3 text-xs text-center text-gray-500">
          PDF, Word, Excel, PowerPoint, Imágenes, ZIP, Texto
        </p>
        {fieldErrors?.attachments && (
          <p className="mt-2 text-sm text-red-600 text-center">{fieldErrors.attachments}</p>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="reset"
          disabled={isLoading}
          onClick={() => {
            if (bannerInputRef.current) bannerInputRef.current.value = ''
            if (attachmentsInputRef.current) attachmentsInputRef.current.value = ''
          }}
          className="px-8 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>Enviar Solicitud</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
