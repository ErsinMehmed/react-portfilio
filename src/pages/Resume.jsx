import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import IconAcademicCap from "../icons/AcademicCap";
import Layout from "../components/Layout";
import SkillBox from "../components/Resume/SkillBox";
import IconWork from "../icons/Work";
import data from "../Data";
import "./../App.css";

const filterNames = ["All", "Frontend", "Backend", "Database", "Other"];

const motionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Resume = () => {
  const [selectedKind, setSelectedKind] = useState("All");
  const [viewed, setViewed] = useState({});

  const skillRef = useRef(null);
  const isInView = useInView(skillRef);

  useEffect(() => {
    console.log("Element is in view: ", isInView);
    setViewed(isInView);
  }, [isInView]);

  const filteredSkills =
    selectedKind !== "All"
      ? data.techSkills.filter((item) => item.kind === selectedKind)
      : data.techSkills;

  return (
    <Layout>
      <div className='px-6 md:px-10 lg:px-14'>
        <h2 className='font-bold text-4xl text-slate-700 flex items-center'>
          Resume
          <div className='h-0.5 w-44 ml-8 bg-gradient-to-r from-[#FA5252] to-[#DD2476] mt-1.5 rounded'></div>
        </h2>

        <div className='mt-8 mb-10 2xl:mb-12'>
          <div className='flex items-center space-x-2 mb-4'>
            <IconAcademicCap className='w-7 h-7 text-[#F95054]' />
            <h4 className='text-2xl text-slate-700 font-semibold'>Education</h4>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-5'>
            {data.educations.map((item, index) => (
              <motion.div
                key={index}
                className={`${item.color} py-4 pl-5 pr-3 space-y-2 mb-5 rounded-lg text-slate-700`}
                {...motionProps}
                transition={{
                  ...motionProps.transition,
                  delay: index * 0.1,
                }}>
                <span className='text-sm text-[#44566C]'>{item.period}</span>

                <h3 className='xl:text-lg 2xl:text-xl font-semibold'>
                  {item.title} - {item.degree}
                </h3>

                <p className='font-semibold'>{item.institution}</p>
              </motion.div>
            ))}
          </div>

          <div className='flex items-center space-x-2 my-4'>
            <IconWork className='w-7 h-7 text-[#F95054]' />
            <h4 className='text-2xl text-slate-700 font-semibold'>
              Experience
            </h4>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-5'>
            {data.experiences.map((item, index) => (
              <motion.div
                key={index}
                className={`${item.color} py-4 pl-5 pr-3 space-y-2 mb-5 rounded-lg text-slate-700`}
                {...motionProps}
                transition={{
                  ...motionProps.transition,
                  delay: index * 0.1,
                }}>
                <span className='text-sm text-[#44566C]'>{item.period}</span>

                <h3 className='xl:text-lg 2xl:text-xl font-semibold'>
                  {item.title}
                  <span className='font-normal'> - {item.location}</span>
                </h3>

                <p className='font-semibold'>{item.company}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        ref={skillRef}
        className='px-6 md:px-10 lg:px-14  h-[720px]'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <h4 className='text-2xl text-slate-700 font-semibold mb-0.5 text-center'>
          Professional Skills
        </h4>

        <div className='text-sm mb-5 text-gray-400 text-center'>
          Hover over name of the programming language, technology, library or
          software to get more information
        </div>

        <div className='flex gap-4 justify-end mb-5'>
          {filterNames.map((item, index) => (
            <span
              key={index}
              className={`${
                selectedKind === item
                  ? "text-[#fa5252]"
                  : "text-slate-700 hover:text-[#fa5252]"
              } cursor-pointer  font-semibold`}
              onClick={() => setSelectedKind(item)}>
              {item}
            </span>
          ))}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 h-fit'>
          {filteredSkills.map((item, index) => (
            <SkillBox
              key={index}
              item={item}
              index={index}
              viewed={viewed}
            />
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Resume;
