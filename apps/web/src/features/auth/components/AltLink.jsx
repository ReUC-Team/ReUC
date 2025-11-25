import React from 'react';

const AltLink = ({text, link, href}) => (
  <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 ml-2 my-2 mb-3">
    {text}
    <a href={href} className="text-lime-600 hover:underline ml-2">{link}</a>
  </p>
);

export default AltLink;