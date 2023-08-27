import React from "react";
import { motion } from "framer-motion";

const EducationBox = (props) => {
  return (
    <motion.div
      className={`${props.item.color} py-4 pl-5 pr-3 space-y-2 mb-5 rounded-lg text-slate-700`}
      {...props.motionProps}
      transition={{
        ...props.motionProps.transition,
        delay: props.index * 0.1,
      }}>
      <span className='text-sm text-[#44566C]'>{props.item.period}</span>

      <h3 className='xl:text-lg 2xl:text-xl font-semibold'>
        {props.item.title} - {props.item.degree}
      </h3>

      <p className='font-semibold'>{props.item.institution}</p>
    </motion.div>
  );
};

export default EducationBox;
