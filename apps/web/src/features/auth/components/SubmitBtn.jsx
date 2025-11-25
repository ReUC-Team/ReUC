import React from 'react';

const SubmitBtn = ({ text, isLoading = false }) => (
  <div
    className={`flex py-3 px-4 rounded-xl shadow-md border border-gray-200 w-full font-semibold text-center items-center justify-center text-white bg-lime-700 transition-all duration-300 ${
      isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    }`}
  >
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center gap-2 cursor-pointer text-sm sm:text-base"
    >
      {isLoading ? (
        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        text
      )}
    </button>
  </div>
);

export default SubmitBtn;
