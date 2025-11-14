import { useEffect } from 'react';
import useEditApplication from '../hooks/useEditApplication';
import useFormProjectMetadata from '../hooks/useFormProjectMetadata';

/**
 * Modal para editar metadata y aprobar una Application
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {Function} onClose - Callback al cerrar el modal
 * @param {string} uuid - UUID de la aplicación
 * @param {Object} application - Datos de la aplicación actual
 * @param {Function} onSuccess - Callback al aprobar exitosamente
 */
export default function EditApplicationModal({ isOpen, onClose, uuid, application, onSuccess }) {
  const { form, fieldErrors, isLoading, handleChange, handleSubmit, initializeForm } = 
    useEditApplication(uuid, (projectUuid) => {
      // ✅ Cerrar modal antes de llamar a onSuccess
      onClose();
      
      // ✅ Pasar UUID del proyecto al componente padre
      onSuccess(projectUuid);
    });

  const { faculties, projectTypes, problemTypes } = useFormProjectMetadata();

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && application) {
      initializeForm(application);
    }
  }, [isOpen, application]);

  if (!isOpen) return null;

  const extendedProblemTypes = [...problemTypes, { problem_type_id: "otro", name: "Otro" }];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Editar y <span className="text-lime-600">Aprobar Proyecto</span>
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={(e) => handleSubmit(e, application)} className="p-6 space-y-6">
          {/* Información del proyecto actual */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800 mb-1">Proyecto: {application?.title}</p>
                <p className="text-xs text-blue-700">
                  Edita la metadata del proyecto si es necesario. Al guardar, el proyecto será aprobado automáticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Tipo de proyecto */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Tipo de proyecto *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectTypes.map(({ project_type_id, name }) => (
                <label key={project_type_id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="projectType"
                    value={project_type_id}
                    checked={form.projectType.includes(Number(project_type_id))}
                    onChange={handleChange}
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <span className="text-gray-700 text-sm">{name}</span>
                </label>
              ))}
            </div>
            {fieldErrors?.projectType && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.projectType}</p>
            )}
          </div>

          {/* Facultades */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Facultades sugeridas *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faculties.map(({ faculty_id, name }) => (
                <label key={faculty_id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="faculty"
                    value={faculty_id}
                    checked={form.faculty.includes(Number(faculty_id))}
                    onChange={handleChange}
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <span className="text-gray-700 text-sm">{name}</span>
                </label>
              ))}
            </div>
            {fieldErrors?.faculty && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.faculty}</p>
            )}
          </div>

          {/* Tipo de problemática */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Tipo de problemática *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extendedProblemTypes.map(({ problem_type_id, name }) => (
                <label key={problem_type_id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="problemType"
                    value={problem_type_id}
                    checked={form.problemType.includes(
                      problem_type_id === "otro" ? "otro" : Number(problem_type_id)
                    )}
                    onChange={handleChange}
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <span className="text-gray-700 text-sm">{name}</span>
                </label>
              ))}
            </div>
            {fieldErrors?.problemType && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.problemType}</p>
            )}

            {/* Campo "Otro" */}
{form.problemType.includes('otro') && (
  <div className="mt-3">
    <label className="block mb-2 text-sm font-medium text-gray-700">
      Describe la problemática: *
    </label>
    <input
      name="problemTypeOther"
      value={form.problemTypeOther}
      onChange={handleChange}
      placeholder="Ej: Problemática educativa rural"
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-lime-500 ${
        fieldErrors?.problemTypeOther ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {fieldErrors?.problemTypeOther && (
      <p className="mt-1 text-sm text-red-600">{fieldErrors.problemTypeOther}</p>
    )}
  </div>
)}

          </div>

          {/* Vigencia */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Vigencia (fecha límite) *
            </label>
            <input
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              type="date"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 ${
                fieldErrors?.deadline ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors?.deadline && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.deadline}</p>
            )}
          </div>

          {/* TODO: Razón de edición (placeholder) */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Razón de la edición
              <span className="ml-2 text-xs text-gray-500 font-normal">(Próximamente)</span>
            </label>
            <textarea
              name="editReason"
              value={form.editReason}
              onChange={handleChange}
              placeholder="Este campo estará disponible próximamente..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 bg-gray-50"
              rows={3}
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              🚧 Esta funcionalidad se implementará después de la revisión con los asesores.
            </p>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Importante</p>
                <p className="text-xs text-yellow-700">
                  Al hacer clic en "Guardar y Aprobar", el proyecto será aprobado inmediatamente con los cambios realizados y 
                  quedará disponible en "Mis Proyectos". Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Aprobando...' : 'Guardar y Aprobar Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}