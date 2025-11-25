import React from 'react';

const Checkbox = ({ name, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 ml-2 mb-5">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-lime-600 border-gray-300 rounded"
    />
    Acepto los términos y condiciones de la plataforma
  </label>
);

export default Checkbox;
