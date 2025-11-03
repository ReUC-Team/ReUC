import React from 'react';

const Overview = ({ profile }) => {
  const firstName = profile.firstName || "ReUC";
  const middleName = profile.middleName || "";
  const lastName = profile.lastName || "";
  const location = profile.location || "Mexico";
  const organizationName = profile.organizationName;
  const description = profile.description || "Sin descripción";
  
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-1">
        {`${firstName} ${middleName} ${lastName}`}
      </h3>
      
      {organizationName && (
        <p className="text-gray-600 font-medium mb-2">{organizationName}</p>
      )}
      
      <p className="text-gray-500 text-sm mb-4">{location}</p>
      
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Sobre mí</h4>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Overview;