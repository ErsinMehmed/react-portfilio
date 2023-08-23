import React from "react";
import { Tooltip } from "flowbite-react";
import { motion } from "framer-motion";

const SkillBox = (props) => {
  return (
    <motion.div
      key={props.index}
      className='mb-5'
      initial={props.viewed ? { opacity: 0, y: 20 } : {}}
      animate={props.viewed ? { opacity: 1, y: 0 } : {}}
      transition={
        props.viewed ? { duration: 0.5, delay: props.index * 0.06 } : {}
      }>
      <div className='flex justify-between mb-1 font-semibold text-[#526377]'>
        {props.item.description ? (
          <Tooltip
            content={props.item.description}
            style='light'
            placement='right'>
            <span className='hover:opacity-70 transition-All cursor-pointer'>
              {props.item.title}
            </span>
          </Tooltip>
        ) : (
          <span className='cursor-default'>{props.item.title}</span>
        )}
        <span>{props.item.percentage}%</span>
      </div>

      <div className='w-full bg-[#edf2f2] rounded-full h-1'>
        <div
          className={`${props.item.color} h-1 rounded-full`}
          style={{
            width: `${props.item.percentage}%`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default SkillBox;
