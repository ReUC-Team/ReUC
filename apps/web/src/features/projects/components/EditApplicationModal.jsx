import { useEffect } from 'react';
import useEditApplication from '../hooks/useEditApplication';
import useFormProjectMetadata from '../hooks/useFormProjectMetadata';
import { formatDateStringSpanish } from '@/utils/dateUtils';

export default function EditApplicationModal({ 
  isOpen, 
  onClose, 
  uuid, 
  application, 
  onEditSuccess,
  onApproveSuccess 
}) {
  const { faculties, projectTypes, problemTypes } = useFormProjectMetadata();

  // Buscar la fecha de creación en múltiples ubicaciones posibles
  const getApplicationCreatedAt = () => {
    if (!application) return undefined;

    return (
      application.createdAt ||
      application.created_at ||
      application.requestedAt ||
      application.requested_at ||
      application.requestDate ||
      application.request_date ||
      application.createdDate ||
      application.created_date ||
      application.dueDate
    );
  };

  const applicationCreatedAt = getApplicationCreatedAt();

  const { 
    form, 
    fieldErrors, 
    isLoading, 
    handleChange, 
    handleSaveOnly,
    handleSaveAndApprove,
    initializeForm,
    deadlineConstraints
  } = useEditApplication(
    uuid,
    () => {
      onClose();
      if (onEditSuccess) {
        onEditSuccess();
      }
    },
    (projectUuid) => {
      onClose();
      if (onApproveSuccess) {
        onApproveSuccess(projectUuid);
      }
    },
    projectTypes,
    applicationCreatedAt
  );

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && application) {
      initializeForm(application);
    }
  }, [isOpen, application]);

  if (!isOpen) return null;

  // Agregar opción "Otro" a los tipos de problemática
  const extendedProblemTypes = [...problemTypes, { problem_type_id: "otro", name: "Otro" }];

  const handleFacultyChange = (facultyId) => {
    handleChange({
      target: {
        name: 'faculty',
        value: facultyId,
        type: 'radio',
        checked: true
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-3xl font-bold">
            Editar <span className="text-lime-700">proyecto</span>
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
        <form className="px-8 py-6 space-y-6">
          
          {/* Tipo de Proyecto */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Tipo de proyecto <span className="text-lime-700">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {projectTypes.map((type) => (
                <label
                  key={type.project_type_id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    form.projectType.includes(type.project_type_id)
                      ? 'border-lime-600 bg-lime-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value={type.project_type_id}
                    checked={form.projectType.includes(type.project_type_id)}
                    onChange={handleChange}
                    className="w-5 h-5 text-lime-600 rounded focus:ring-lime-500 border-gray-300"
                    style={{ accentColor: '#65a30d' }}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">{type.name}</span>
                    {type.name !== 'Proyectos de investigación' ? (
                      <span className="text-xs text-gray-500">
                      {type.minEstimatedMonths} meses
                    </span>
                    ) : (
                      <span className="text-xs text-gray-500">
                      De {type.minEstimatedMonths} a {type.maxEstimatedMonths} meses
                    </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {fieldErrors.projectType && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.projectType}</p>
            )}
          </div>

          {/* Facultad */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Facultad <span className="text-lime-700">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {faculties.map((faculty) => (
                <label
                  key={faculty.faculty_id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    form.faculty.includes(faculty.faculty_id)
                      ? 'border-lime-600 bg-lime-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="faculty"
                    value={faculty.faculty_id}
                    checked={form.faculty.includes(faculty.faculty_id)}
                    onChange={() => handleFacultyChange(faculty.faculty_id)}
                    className="w-5 h-5 text-lime-600 focus:ring-lime-500 border-gray-300"
                    style={{ accentColor: '#65a30d' }}
                  />
                  <span className="text-sm font-medium">{faculty.name}</span>
                </label>
              ))}
            </div>
            {fieldErrors.faculty && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.faculty}</p>
            )}
          </div>

          {/* Tipo de Problemática */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Tipo de problemática <span className="text-lime-700">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {extendedProblemTypes.map((type) => (
                <label
                  key={type.problem_type_id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    form.problemType.includes(type.problem_type_id) ||
                    form.problemType.includes("otro")
                      ? 'border-lime-600 bg-lime-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="problemType"
                    value={type.problem_type_id}
                    checked={form.problemType.includes(type.problem_type_id) ||
                             (type.problem_type_id === "otro" && form.problemType.includes("otro"))}
                    onChange={handleChange}
                    className="w-5 h-5 text-lime-600 rounded focus:ring-lime-500 border-gray-300"
                    style={{ accentColor: '#65a30d' }}
                  />
                  <span className="text-sm font-medium">{type.name}</span>
                </label>
              ))}
            </div>
            {fieldErrors.problemType && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.problemType}</p>
            )}
          </div>

          {/* Campo "Otro" - Descripción personalizada */}
          {form.problemType.includes("otro") && (
            <div>
              <label className="block text-lg font-semibold mb-2">
                Describe la problemática <span className="text-lime-700">*</span>
              </label>
              <textarea
                name="problemTypeOther"
                value={form.problemTypeOther}
                onChange={handleChange}
                placeholder="Describe la problemática personalizada..."
                rows="3"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.problemTypeOther
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-lime-500'
                }`}
              />
              {fieldErrors.problemTypeOther && (
                <p className="text-red-500 text-sm mt-2">{fieldErrors.problemTypeOther}</p>
              )}
            </div>
          )}

          {/* Vigencia - Fecha límite del proyecto */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Vigencia <span className="text-lime-700">*</span>
            </label>
            
            {/* Información del rango de fechas permitidas */}
            {deadlineConstraints.projectTypeName && deadlineConstraints.applicationDate ? (
              <div className="mb-3 p-4 bg-gradient-to-r from-lime-50 to-lime-100 border-l-4 border-lime-500 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-lime-900 mb-2">
                      {deadlineConstraints.projectTypeName}
                    </p>
                    <div className="space-y-2 text-xs text-lime-800">
                      <p className="bg-lime-600 p-2 rounded text-white w-fit">
                        <span className="font-semibold">Fecha de solicitud:</span>{' '}
                        {formatDateStringSpanish(deadlineConstraints.applicationDate)}
                      </p>
                      <p>
                        <span className="font-semibold">Fecha mínima:</span>{' '}
                        {formatDateStringSpanish(deadlineConstraints.min)}
                      </p>
                      <p>
                        <span className="font-semibold">Fecha máxima:</span>{' '}
                        {formatDateStringSpanish(deadlineConstraints.max)}
                      </p>
                      <p className="text-white font-semibold mt-2 bg-lime-800 p-2 rounded w-fit">
                        Duración del proyecto: {deadlineConstraints.minMonths} a {deadlineConstraints.maxMonths} meses desde la fecha de solicitud
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-800">
                  Selecciona un tipo de proyecto para ver el rango de fechas permitidas
                </p>
              </div>
            )}

            {/* Input de fecha */}
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={deadlineConstraints.min || undefined}
              max={deadlineConstraints.max || undefined}
              disabled={!deadlineConstraints.min}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                fieldErrors.deadline
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : !deadlineConstraints.min
                  ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-300 focus:ring-lime-500 hover:border-gray-400'
              }`}
            />
            
            {/* Mensaje de error */}
            {fieldErrors.deadline && (
              <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-semibold flex-1">
                  {fieldErrors.deadline}
                </p>
              </div>
            )}

            {/* Mensaje de éxito */}
            {!fieldErrors.deadline && form.deadline && deadlineConstraints.min && (
              <div className="mt-2 p-3 bg-lime-50 border-l-4 border-lime-500 rounded flex items-start gap-2">
                <svg className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-lime-700 text-sm font-semibold">
                  Fecha válida seleccionada
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={(e) => handleSaveOnly(e, application)}
              disabled={isLoading}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              type="button"
              onClick={(e) => handleSaveAndApprove(e, application)}
              disabled={isLoading || !deadlineConstraints.min}
              className="flex-1 bg-lime-600 text-white py-3 rounded-lg font-semibold hover:bg-lime-700 transition disabled:bg-lime-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Aprobando...' : 'Guardar y aprobar proyecto'}
            </button>
          </div>

          {/* Información importante */}
          <div className="p-4 bg-gray-200 border border-gray-300 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-1">Información importante:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>"Guardar cambios":</strong> Solo actualiza la información, la solicitud permanece pendiente</li>
              <li><strong>"Guardar y aprobar proyecto":</strong> Actualiza la información y crea el proyecto inmediatamente</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
