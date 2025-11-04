import React from 'react';

const Overview = ({ profile }) => {
  const firstName = profile.firstName || "ReUC";
  const middleName = profile.middleName || "";
  const lastName = profile.lastName || "";
  const location = profile.location || "Mexico";
  const description = profile.description || "";
  
  return (<div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-xl font-semibold mb-2">{`${firstName} ${middleName} ${lastName}`}</h3>
    <p className="text-gray-700 leading-relaxed">
      {description}
      {location}
    </p>
  </div>)
};

export default Overview;
