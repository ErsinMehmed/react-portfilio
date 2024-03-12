import React, { useState } from "react";
import IconAcademicCap from "../icons/AcademicCap";
import Layout from "../components/Layout";
import SkillBox from "../components/Resume/SkillBox";
import EducationBox from "../components/Resume/EducationBox";
import ExperienceBox from "../components/Resume/ExperienceBox";
import InViewAnimation from "../components/InViewAnimation";
import IconWork from "../icons/Work";
import { useInView } from "react-intersection-observer";
import { techSkills, educations, experiences } from "../Data";

const filterNames = ["All", "Frontend", "Backend", "Database", "Other"];

const Resume = () => {
  const [selectedKind, setSelectedKind] = useState("All");
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  const filteredSkills =
    selectedKind !== "All"
      ? techSkills.filter((item) => item.kind === selectedKind)
      : techSkills;

  return (
    <Layout
      classes='px-6 md:px-10 lg:px-14'
      header='Resume'>
      <div className='mt-8 mb-10 2xl:mb-12'>
        <InViewAnimation>
          <div className='flex items-center space-x-2 mb-4'>
            <IconAcademicCap className='w-6 h-6 sm:w-7 sm:h-7 text-[#1b74e4]' />
            <h4 className='text-xl sm:text-2xl text-slate-700 font-semibold'>
              Education
            </h4>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-5'>
            {educations.map((item, index) => (
              <InViewAnimation
                key={index}
                delay={index * 0.2}>
                <EducationBox item={item} />
              </InViewAnimation>
            ))}
          </div>
        </InViewAnimation>

        <InViewAnimation>
          <div className='flex items-center space-x-2 my-4'>
            <IconWork className='w-6 h-6 sm:w-7 sm:h-7 text-[#1b74e4]' />
            <h4 className='text-xl sm:text-2xl text-slate-700 font-semibold'>
              Experience
            </h4>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-5'>
            {experiences.map((item, index) => (
              <InViewAnimation
                key={index}
                delay={index * 0.2}>
                <ExperienceBox item={item} />
              </InViewAnimation>
            ))}
          </div>
        </InViewAnimation>
      </div>

      <InViewAnimation delay={0.2}>
        <div className='px-3'>
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
                    ? "text-[#1b74e4]"
                    : "text-slate-700 hover:text-[#1b74e4]"
                } cursor-pointer font-semibold text-base`}
                onClick={() => setSelectedKind(item)}>
                {item}
              </span>
            ))}
          </div>

          <div
            ref={ref}
            className='grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10'>
            {filteredSkills.map((item, index) => (
              <InViewAnimation
                key={index}
                delay={index <= 12 ? index * 0.1 : index * 0.08}>
                <SkillBox
                  item={item}
                  index={index}
                  inView={inView}
                />
              </InViewAnimation>
            ))}
          </div>
        </div>
      </InViewAnimation>
    </Layout>
  );
};

export default Resume;
