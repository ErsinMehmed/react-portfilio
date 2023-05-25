import React, { useState } from "react";
import { Tooltip } from "flowbite-react";
import Layout from "./../components/Layout";
import IconAcademicCap from "./../icons/AcademicCap";
import IconWork from "./../icons/Work";

const educations = [
  {
    title: "Master",
    period: "02.2023 - Present",
    degree: "Mobile and Web Technologies",
    institution: "University of Economics Varna",
    color: "bg-[#fff4f4]",
  },
  {
    title: "Bachelor",
    period: "09.2018 - 06.2022",
    degree: "Business Information System",
    institution: "University of Economics Varna",
    color: "bg-[#fff1fb]",
  },
  {
    title: "High School",
    period: "09.2013 - 05.2018",
    degree: "Sport Coach",
    institution: `Sport School "Georgi Benkovski" Varna`,
    color: "bg-[#fff4f4]",
  },
];

const experiences = [
  {
    title: "Full stack developer",
    period: "10.2022 - Present",
    location: "Varna",
    company: "James IT Services",
    color: "bg-[#eef5fa]",
  },
  {
    title: "IT support & consultant",
    period: "04.2022 - 09.2022",
    location: "Varna",
    company: "ENERGO PRO",
    color: "bg-[#f2f4ff]",
  },
  {
    title: "Manager in a small company",
    period: "04.2021 - 10.2021",
    location: "Varna",
    company: "Briella Ltd",
    color: "bg-[#eef5fa]",
  },
  {
    title: "Currency cashier",
    period: "04.2019 - 09.2019",
    location: "Golden Sands",
    company: "Edives Ltd",
    color: "bg-[#f3faff]",
  },
  {
    title: "Tourism",
    period: "04.2018 - 09.2018",
    location: "Golden Sands",
    company: "Tourism",
    color: "bg-[#fcf4ff]",
  },
];

let skills = [
  {
    title: "HTML",
    percentage: "100",
    kind: "front-end",
    description: "I am fluent in HTML. I have used HTML in many projects.",
    color: "bg-red-400",
  },
  {
    title: "CSS",
    kind: "front-end",
    description:
      "I am excellent at CSS. I have used CSS in many of my projects. I am skilled in using grid and flexbox for positioning elements, and I also use CSS for animating elements.",
    percentage: "90",
    color: "bg-rose-400",
  },
  {
    title: "Tailwind",
    kind: "front-end",
    description:
      "I am excellent at Tailwind. I have used Tailwind in many of my projects.",
    percentage: "90",
    color: "bg-pink-400",
  },
  {
    title: "Bootstrap",
    kind: "front-end",
    description:
      "I am proficient in Bootstrap. I have used Bootstrap in one of my projects.",
    percentage: "70",
    color: "bg-fuchsia-400",
  },
  {
    title: "JavaScript",
    kind: "front-end",
    description:
      "I am proficient in JavaScript. I have used JavaScript in many of my projects. I use JS for animations, form validations, showing and hiding elements, and more.",
    percentage: "70",
    color: "bg-purple-400",
  },
  {
    title: "Vue.js",
    kind: "front-end",
    percentage: "70",
    description:
      "I am proficient in Vue.js. I have used it in one of my professional projects.",
    color: "bg-violet-400",
  },
  {
    title: "Inertia.js",
    kind: "front-end",
    percentage: "50",
    color: "bg-indigo-400",
  },
  {
    title: "React.js",
    kind: "front-end",
    percentage: "50",
    color: "bg-blue-400",
  },
  {
    title: "jQuery",
    kind: "front-end",
    percentage: "70",
    description:
      "I am proficient in jQuery. I have used jQuery in many of my projects. I use the library for real-time element manipulation without the need for button clicks.",
    color: "bg-sky-400",
  },
  {
    title: "AJAX",
    kind: "front-end",
    percentage: "60",
    description:
      "I have been using AJAX for some time now. I have used AJAX in two projects. I use the technology for dynamically retrieving and saving data from the database.",
    color: "bg-cyan-400",
  },
  {
    title: "PHP",
    kind: "back-end",
    percentage: "70",
    description:
      "I am very proficient in PHP. I have used PHP for data retrieval, CRUD operations, functionalities, and more.",
    color: "bg-teal-400",
  },
  {
    title: "Laravel",
    kind: "back-end",
    percentage: "50",
    description: "I develop projects at work using Laravel.",
    color: "bg-emerald-400",
  },
  {
    title: ".NET",
    kind: "back-end",
    percentage: "60",
    description: "Having a good command of .NET, my level is advanced.",
    color: "bg-green-400",
  },
  {
    title: "ASP.NET",
    kind: "back-end",
    percentage: "60",
    description: "I am good at ASP.NET. My level is advanced.",
    color: "bg-lime-400",
  },
  {
    title: "Java",
    kind: "back-end",
    percentage: "30",
    description: "I know the basics of JAVA.",
    color: "bg-yellow-400",
  },
  {
    title: "MySQL",
    kind: "database",
    percentage: "80",
    description:
      "I am fluent in MySQL. I have used MySQL in several projects. I am well versed in CRUD operations.",
    color: "bg-amber-400",
  },
  {
    title: "SQL",
    kind: "database",
    percentage: "70",
    description:
      "I am fluent in SQL. I have used SQL in several projects. I am well versed in CRUD operations.",
    color: "bg-orange-400",
  },
  {
    title: "Git",
    kind: "other",
    percentage: "60",
    color: "bg-red-400",
  },
  {
    title: "Power BI",
    kind: "other",
    percentage: "60",
    color: "bg-pink-400",
  },
  {
    title: "Qlik Sense",
    kind: "other",
    percentage: "70",
    color: "bg-rose-400",
  },
  {
    title: "Dynamics 365",
    kind: "other",
    percentage: "60",
    color: "bg-purple-400",
  },
  {
    title: "Jira",
    kind: "other",
    percentage: "90",
    color: "bg-fuchsia-400",
  },
];

const Resume = () => {
  const [selectedKind, setSelectedKind] = useState("all");

  const filteredSkills =
    selectedKind !== "all"
      ? skills.filter((item) => item.kind === selectedKind)
      : skills;

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

            {educations.map((item, index) => {
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

            {experiences.map((item, index) => {
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
          <span
            className={`${
              selectedKind === "all"
                ? "text-[#fa5252]"
                : "text-slate-700 hover:text-[#fa5252]"
            } cursor-pointer  font-semibold`}
            onClick={() => setSelectedKind("all")}
          >
            All
          </span>

          <span
            className={`${
              selectedKind === "front-end"
                ? "text-[#fa5252]"
                : "text-slate-700 hover:text-[#fa5252]"
            } cursor-pointer  font-semibold`}
            onClick={() => setSelectedKind("front-end")}
          >
            Front-end
          </span>

          <span
            className={`${
              selectedKind === "back-end"
                ? "text-[#fa5252]"
                : "text-slate-700 hover:text-[#fa5252]"
            } cursor-pointer  font-semibold`}
            onClick={() => setSelectedKind("back-end")}
          >
            Back-end
          </span>

          <span
            className={`${
              selectedKind === "database"
                ? "text-[#fa5252]"
                : "text-slate-700 hover:text-[#fa5252]"
            } cursor-pointer  font-semibold`}
            onClick={() => setSelectedKind("database")}
          >
            Database
          </span>

          <span
            className={`${
              selectedKind === "other"
                ? "text-[#fa5252]"
                : "text-slate-700 hover:text-[#fa5252]"
            } cursor-pointer  font-semibold`}
            onClick={() => setSelectedKind("other")}
          >
            Other
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-10">
          {filteredSkills.map((item, index) => {
            return (
              <div key={index} className="mb-5">
                <div className="flex justify-between mb-1 font-semibold text-[#526377]">
                  {item.description ? (
                    <Tooltip
                      content={item.description}
                      style="light"
                      placement="right"
                    >
                      <span className="hover:opacity-70 transition-all cursor-pointer">
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
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Resume;
