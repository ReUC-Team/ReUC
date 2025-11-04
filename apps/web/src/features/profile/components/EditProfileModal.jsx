import useEditProfile from "../hooks/useEditProfile";
import { getNames } from "country-list";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const EditProfileModal = ({ onClose, profile }) => {
  const {
    form,
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit
  } = useEditProfile(onClose, profile)

  const options = Object.entries(getNames()).map(([code, name]) => ({
    value: code,
    label: name,
  }));

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 relative transition-transform transform scale-100 shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none">
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Editar Perfil</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Nombre"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido*</label>
            <input
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Primer Apellido"
              value={form.middleName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido*</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Segundo Apellido"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación*</label>
            <Select
              id="location"
              onChange={handleLocationChange}
              options={options}
              placeholder="Elige tu ubicación"
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto*</label>
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
              inputClass="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-lime-500 focus:outline-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-lime-600 text-white hover:bg-lime-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
