import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import IconAcademicCap from "../icons/AcademicCap";
import Layout from "../components/Layout";
import SkillBox from "../components/Resume/SkillBox";
import EducationBox from "../components/Resume/EducationBox";
import ExperienceBox from "../components/Resume/ExperienceBox";
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
    setViewed(isInView);
  }, [isInView]);

  const filteredSkills =
    selectedKind !== "All"
      ? data.techSkills.filter((item) => item.kind === selectedKind)
      : data.techSkills;

  return (
    <Layout
      classes='px-6 md:px-10 lg:px-14'
      header='Resume'>
      <div className='mt-8 mb-10 2xl:mb-12'>
        <div className='flex items-center space-x-2 mb-4'>
          <IconAcademicCap className='w-6 h-6 sm:w-7 sm:h-7 text-[#F95054]' />
          <h4 className='text-xl sm:text-2xl text-slate-700 font-semibold'>
            Education
          </h4>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-5'>
          {data.educations.map((item, index) => (
            <EducationBox
              key={index}
              item={item}
              index={index}
              motionProps={motionProps}
            />
          ))}
        </div>

        <div className='flex items-center space-x-2 my-4'>
          <IconWork className='w-6 h-6 sm:w-7 sm:h-7 text-[#F95054]' />
          <h4 className='text-xl sm:text-2xl text-slate-700 font-semibold'>
            Experience
          </h4>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-5'>
          {data.experiences.map((item, index) => (
            <ExperienceBox
              key={index}
              item={item}
              index={index}
              motionProps={motionProps}
            />
          ))}
        </div>
      </div>

      <motion.div
        ref={skillRef}
        className='px-6 md:px-10 lg:px-14'
        {...motionProps}>
        <h4 className='text-xl sm:text-2xl text-slate-700 font-semibold mb-0.5 text-center'>
          Professional Skills
        </h4>

        <div className='text-sm mb-5 text-gray-500 text-center'>
          Hover over name of the programming language, technology, library or
          software to get more information
        </div>

        <div className='flex gap-4 justify-center sm:justify-end mb-5'>
          {filterNames.map((item, index) => (
            <span
              key={index}
              className={`${
                selectedKind === item
                  ? "text-[#fa5252]"
                  : "text-slate-700 hover:text-[#fa5252]"
              } cursor-pointer font-semibold text-base`}
              onClick={() => setSelectedKind(item)}>
              {item}
            </span>
          ))}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10'>
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
