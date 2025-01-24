import React, { useState } from "react";
import Layout from "../components/Layout";

const projectTypes = ["All", "Personal", "Professional"];

const Project = () => {
  const [selectedType, setSelectedType] = useState("All");

  return (
    <Layout
      classes='px-6 md:px-10 lg:px-14'
      header='Projects'>
      <div className='flex gap-4 justify-center sm:justify-end mb-5 mt-6'>
        {projectTypes.map((item, index) => (
          <span
            key={index}
            className={`${
              selectedType === item
                ? "text-[#1b74e4]"
                : "text-slate-700 hover:text-[#1b74e4]"
            } cursor-pointer font-semibold text-base`}
            onClick={() => setSelectedType(item)}>
            {item}
          </span>
        ))}
      </div>

      <div className='w-full text-center text-slate-700 text-2xl py-16 font-semibold'>
        Coming Soon
      </div>
    </Layout>
  );
};

export default Project;
