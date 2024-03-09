import React from "react";

const ExperienceBox = (props) => {
  return (
    <div
      className={`${props.item.color} py-4 pl-5 pr-3 space-y-2 mb-5 rounded-lg text-slate-700`}>
      <span className='text-sm text-[#44566C]'>{props.item.period}</span>

      <h3 className='xl:text-lg 2xl:text-xl font-semibold'>
        {props.item.title}
        <span className='font-normal'> - {props.item.location}</span>
      </h3>

      <p className='font-semibold'>{props.item.company}</p>
    </div>
  );
};

export default ExperienceBox;
