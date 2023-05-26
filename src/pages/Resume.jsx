import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Tooltip } from "flowbite-react";
import IconAcademicCap from "../icons/AcademicCap";
import Layout from "../components/Layout";
import IconWork from "../icons/Work";
import data from "../Data";
import "./../App.css";

const filterNames = ["All", "Front-end", "Back-end", "Database", "Other"];

const Resume = () => {
  const [selectedKind, setSelectedKind] = useState("All");

  const filteredSkills =
    selectedKind !== "All"
      ? data.techSkills.filter((item) => item.kind === selectedKind)
      : data.techSkills;

  return (
    <Layout>
      <div className="px-6 md:px-10 lg:px-14">
        <h2 className="font-bold text-4xl text-slate-700 flex items-center">
          Resume
          <div className="h-0.5 w-44 ml-8 bg-gradient-to-r from-[#FA5252] to-[#DD2476] mt-1.5 rounded"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-6 mt-8 mb-10 2xl:mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <IconAcademicCap className="w-7 h-7 text-[#F95054]" />
              <h4 className="text-2xl text-slate-700 font-semibold">
                Education
              </h4>
            </div>

            {data.educations.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${item.color} py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg text-slate-700`}
                >
                  <span className="text-sm text-[#44566C]">{item.period}</span>

                  <h3 className="xl:text-lg 2xl:text-xl font-semibold">
                    {item.title} - {item.degree}
                  </h3>

                  <p className="font-semibold">{item.institution}</p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <IconWork className="w-7 h-7 text-[#F95054]" />
              <h4 className="text-2xl text-slate-700 font-semibold">
                Experience
              </h4>
            </div>

            {data.experiences.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${item.color} py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg text-slate-700`}
                >
                  <span className="text-sm text-[#44566C]">{item.period}</span>

                  <h3 className="xl:text-lg 2xl:text-xl font-semibold">
                    {item.title}
                    <span className="font-normal"> - {item.location}</span>
                  </h3>

                  <p className="font-semibold">{item.company}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#f8fbfb] py-10 2xl:py-2 px-7 md:px-10 lg:px-20">
        <h4 className="text-2xl text-slate-700 font-semibold mb-0.5 text-center">
          Professional Skills
        </h4>

        <div className="text-sm mb-5 text-gray-400 text-center">
          Hover over name of the programming language, technology, library or
          software to get more information
        </div>

        <div className="flex gap-4 justify-end mb-5">
          {filterNames.map((item, index) => {
            return (
              <span
                key={index}
                className={`${
                  selectedKind === item
                    ? "text-[#fa5252]"
                    : "text-slate-700 hover:text-[#fa5252]"
                } cursor-pointer  font-semibold`}
                onClick={() => setSelectedKind(item)}
              >
                {item}
              </span>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-x-10">
          <TransitionGroup component={null}>
            {filteredSkills.map((item, index) => {
              return (
                <CSSTransition
                  key={index}
                  timeout={500}
                  classNames="fade"
                  unmountOnExit
                >
                  <div key={index} className="mb-5">
                    <div className="flex justify-between mb-1 font-semibold text-[#526377]">
                      {item.description ? (
                        <Tooltip
                          content={item.description}
                          style="light"
                          placement="right"
                        >
                          <span className="hover:opacity-70 transition-All cursor-pointer">
                            {item.title}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="cursor-default">{item.title}</span>
                      )}
                      <span>{item.percentage}%</span>
                    </div>

                    <div className="w-full bg-[#edf2f2] rounded-full h-1">
                      <div
                        className={`${item.color} h-1 rounded-full`}
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </div>
      </div>
    </Layout>
  );
};

export default Resume;
