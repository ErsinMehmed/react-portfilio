import React from "react";
import IconSpinner from "../icons/Spinner";

const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-pink-100'>
      <div className='flex justify-center items-center space-x-1 font-semibold text-gray-700'>
        <IconSpinner className='w-20 h-20 animate-spin' />

        <div>Loading ...</div>
      </div>
    </div>
  );
};

export default Loading;
