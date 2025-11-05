import useEditProfile from "../hooks/useEditProfile";
import { getNames } from "country-list";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const EditProfileModal = ({ onClose, profile }) => {
  const {
    form,
    fieldErrors,
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit
  } = useEditProfile(onClose, profile);

  const options = Object.entries(getNames()).map(([code, name]) => ({
    value: code,
    label: name,
  }));

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 relative transition-transform transform scale-100 shadow-lg max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>
        
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Editar Perfil
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre*
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Nombre"
              value={form.firstName}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none ${
                fieldErrors.firstName ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
            )}
          </div>

          {/* Primer Apellido */}
          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Primer Apellido*
            </label>
            <input
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Primer Apellido"
              value={form.middleName}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none ${
                fieldErrors.middleName ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.middleName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.middleName}</p>
            )}
          </div>

          {/* Segundo Apellido */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Segundo Apellido*
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Segundo Apellido"
              value={form.lastName}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none ${
                fieldErrors.lastName ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
          {/* Nombre de la Organización */}
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Organización*
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              placeholder="Empresa o institución"
              value={form.organizationName}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none ${
                fieldErrors.organizationName ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.organizationName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.organizationName}</p>
            )}
          </div>

          {/* Ubicación */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación*
            </label>
            <Select
              id="location"
              onChange={handleLocationChange}
              options={options}
              placeholder="Elige tu ubicación"
              value={options.find(opt => opt.label === form.location)}
              className={`w-full ${fieldErrors.location ? 'border-red-500' : ''}`}
              classNamePrefix="react-select"
            />
            {fieldErrors.location && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.location}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de contacto*
            </label>
            <PhoneInput
              country="mx"
              value={form.phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Teléfono de contacto"
              inputProps={{
                name: "phoneNumber",
                id: "phoneNumber",
              }}
              countryCodeEditable={false}
              containerClass="w-full"
              inputClass={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none ${
                fieldErrors.phoneNumber ? 'border-red-500' : ''
              }`}
            />
            {fieldErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Cuéntanos sobre ti o tu organización"
              value={form.description}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none ${
                fieldErrors.description ? 'border-red-500' : ''
              }`}
              rows={3}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-lime-600 text-white hover:bg-lime-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;