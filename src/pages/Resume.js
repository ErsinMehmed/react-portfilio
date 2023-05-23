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

const skills = [
  {
    title: "HTML",
    percentage: "100",
    color: "bg-red-400",
  },
  {
    title: "CSS",
    percentage: "90",
    color: "bg-rose-400",
  },
  {
    title: "Tailwind",
    percentage: "90",
    color: "bg-pink-400",
  },
  {
    title: "Bootstrap",
    percentage: "70",
    color: "bg-fuchsia-400",
  },
  {
    title: "JavaScript",
    percentage: "70",
    color: "bg-purple-400",
  },
  {
    title: "Vue.js",
    percentage: "70",
    color: "bg-violet-400",
  },
  {
    title: "Inertia.js",
    percentage: "50",
    color: "bg-indigo-400",
  },
  {
    title: "React.js",
    percentage: "50",
    color: "bg-blue-400",
  },
  {
    title: "jQuery",
    percentage: "70",
    color: "bg-sky-400",
  },
  {
    title: "AJAX",
    percentage: "60",
    color: "bg-cyan-400",
  },
  {
    title: "PHP",
    percentage: "70",
    color: "bg-teal-400",
  },
  {
    title: "Laravel",
    percentage: "50",
    color: "bg-emerald-400",
  },
  {
    title: ".NET",
    percentage: "50",
    color: "bg-green-400",
  },
  {
    title: "ASP.NET",
    percentage: "50",
    color: "bg-lime-400",
  },
  {
    title: "Java",
    percentage: "30",
    color: "bg-yellow-400",
  },
  {
    title: "MySQL",
    percentage: "80",
    color: "bg-amber-400",
  },
  {
    title: "SQL",
    percentage: "70",
    color: "bg-orange-400",
  },
  {
    title: "Git",
    percentage: "60",
    color: "bg-red-400",
  },
  {
    title: "Power BI",
    percentage: "60",
    color: "bg-pink-400",
  },
  {
    title: "Qlik Sense",
    percentage: "70",
    color: "bg-rose-400",
  },
  {
    title: "Dynamics 365",
    percentage: "60",
    color: "bg-purple-400",
  },
  {
    title: "Jira",
    percentage: "90",
    color: "bg-fuchsia-400",
  },
];

const Resume = () => {
  return (
    <Layout>
      <div className="px-6 md:px-10 lg:px-14">
        <h2 className="font-bold text-4xl text-slate-700 flex items-center">
          Resume
          <div className="h-0.5 w-44 ml-8 bg-gradient-to-r from-[#FA5252] to-[#DD2476] mt-1.5 rounded"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-6 mt-8 mb-12">
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

      <div className="bg-[#f8fbfb] py-12 px-7 md:px-10 lg:px-20 xl:px-24">
        <h4 className="text-2xl text-slate-700 font-semibold mb-6">
          Working Skills
        </h4>

        <div className="grid grid-cols-2 gap-x-10">
          {skills.map((item, index) => {
            return (
              <div key={index} className="mb-5">
                <div className="flex justify-between mb-1 font-semibold text-[#526377]">
                  <span>{item.title}</span>
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

