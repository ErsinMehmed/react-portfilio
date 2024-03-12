import React, { useState, useEffect } from "react";
import { Tooltip } from "flowbite-react";
import { motion } from "framer-motion";

const SkillBox = (props) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let interval = 0;

    if (props.inView) {
      interval = setInterval(() => {
        if (percentage < props.item.percentage) {
          setPercentage((prevPercentage) => prevPercentage + 1);
        }
      }, 25); 
    }

    return () => clearInterval(interval);
  }, [percentage, props.item.percentage, props.inView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: props.index * 0.05 }}
    >
      <div className='flex justify-between mb-1 font-semibold text-[#526377]'>
        {props.item.description ? (
          <Tooltip
            content={props.item.description}
            placement='right'
            arrow={false}
          >
            <span className='hover:opacity-70 transition-All cursor-pointer'>
              {props.item.title}
            </span>
          </Tooltip>
        ) : (
          <span className='cursor-default'>{props.item.title}</span>
        )}

        <span>{percentage}%</span>
      </div>

      <div className='w-full bg-[#edf2f2] rounded-full h-1'>
        <div
          className={`${props.item.color} h-1 rounded-full`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default SkillBox;