import React from "react";

const EducationBox = (props) => {
  return (
    <div
      className={`${props.item.color} py-4 pl-5 pr-3 space-y-2 mb-5 rounded-lg text-slate-700`}>
      <span className='text-sm text-[#44566C]'>{props.item.period}</span>

      <h3 className='xl:text-lg 2xl:text-xl font-semibold'>
        {props.item.title} - {props.item.degree}
      </h3>

      <p className='font-semibold'>{props.item.institution}</p>
    </div>
  );
};

export default EducationBox;
