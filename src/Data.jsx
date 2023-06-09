import IconFacebook from "./icons/Facebook";
import IconLinkedIn from "./icons/LinkedIn";
import IconInstagram from "./icons/Instagram";
import IconGitHub from "./icons/GitHub";
import IconUser from "./icons/User";
import IconLocation from "./icons/Location";
import IconPhone from "./icons/Phone";
import IconEmail from "./icons/Email";
import IconSpeaker from "./icons/Speaker";
import IconRocket from "./icons/Rocket";
import IconStar from "./icons/Star";
import IconDocument from "./icons/Document";
import IconUIdesign from "./icons/UIdesign";
import IconAppDev from "./icons/AppDev";
import IconManagement from "./icons/Management";
import IconWebDev from "./icons/WebDev";

const data = {
  headerLinks: [
    {
      title: "About",
      href: "/",
      icon: IconUser,
    },
    {
      title: "Resume",
      href: "/resume",
      icon: IconDocument,
    },
    {
      title: "Project",
      href: "/project",
      icon: IconRocket,
    },
    {
      title: "Certification",
      href: "/certification",
      icon: IconStar,
    },
  ],
  socialLinks: [
    {
      href: "https://www.facebook.com/ersin.mehmed/",
      icon: IconFacebook,
    },
    {
      href: "https://github.com/ErsinMehmed",
      icon: IconInstagram,
    },
    {
      href: "https://www.linkedin.com/in/ersin-hyusein-72a184241/",
      icon: IconLinkedIn,
    },
    {
      href: "https://github.com/ErsinMehmed",
      icon: IconGitHub,
    },
  ],
  personalInfo: [
    {
      title: "Age",
      text: "23",
      icon: IconUser,
      iconColor: "text-red-400",
    },
    {
      title: "Location",
      text: "Varna, Bulgaria",
      icon: IconLocation,
      iconColor: "text-pink-400",
    },
    {
      title: "Phone",
      text: "+359 899 626273",
      icon: IconPhone,
      iconColor: "text-emerald-400",
    },
    {
      title: "Email",
      text: "ersin99mehmed@abv.bg",
      icon: IconEmail,
      iconColor: "text-blue-400",
    },
    {
      title: "Languages",
      text: "Bulgarian, English, Turkish",
      icon: IconSpeaker,
      iconColor: "text-purple-400",
    },
  ],
  educations: [
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
  ],
  experiences: [
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
      title: "Manager in a smAll company",
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
  ],
  mainSkills: [
    {
      title: "Design",
      text: "I specialize in creating visually captivating and user-friendly designs that leave a lasting impression. Each design is meticulously crafted to align with every brand identity and meet specific goals.",
      icon: IconUIdesign,
      color: "bg-[#fcf4ff]",
    },
    {
      title: "App Development",
      text: "With a passion for innovation and a keen eye for every detail, I specialize in creating exceptional applications that captivate. Through a collaborative and client-focused approach.",
      icon: IconAppDev,
      color: "bg-[#fefaf0]",
    },
    {
      title: "Management",
      text: "As an innovator, I bring a strategic mindset and hands-on approach to every project. I have experience leading small initiatives, ensuring seamless coordination and alignment with organizational goals.",
      icon: IconManagement,
      color: "bg-[#fff0f8]",
    },
    {
      title: "Web Development",
      text: "In today's, a strong online presence is essential businesses. As a developer, I specialize in creating user-centric web apps/systems/websites that not only attract attention but also deliver exceptional functionality.",
      icon: IconWebDev,
      color: "bg-[#f3faff]",
    },
  ],
  techSkills: [
    {
      title: "HTML",
      percentage: "100",
      kind: "Front-end",
      description: "I am fluent in HTML. I have used HTML in many projects.",
      color: "bg-red-400",
    },
    {
      title: "CSS",
      kind: "Front-end",
      description:
        "I am excellent at CSS. I have used CSS in many of my projects. I am skilled in using grid and flexbox for positioning elements, and I also use CSS for animating elements.",
      percentage: "90",
      color: "bg-rose-400",
    },
    {
      title: "Tailwind",
      kind: "Front-end",
      description:
        "I am excellent at Tailwind. I have used Tailwind in many of my projects.",
      percentage: "90",
      color: "bg-pink-400",
    },
    {
      title: "Bootstrap",
      kind: "Front-end",
      description:
        "I am proficient in Bootstrap. I have used Bootstrap in one of my projects.",
      percentage: "70",
      color: "bg-fuchsia-400",
    },
    {
      title: "JavaScript",
      kind: "Front-end",
      description:
        "I am proficient in JavaScript. I have used JavaScript in many of my projects. I use JS for animations, form validations, showing and hiding elements, and more.",
      percentage: "70",
      color: "bg-purple-400",
    },
    {
      title: "Vue.js",
      kind: "Front-end",
      percentage: "70",
      description:
        "I am proficient in Vue.js. I have used it in one of my professional projects.",
      color: "bg-violet-400",
    },
    {
      title: "Inertia.js",
      kind: "Front-end",
      percentage: "50",
      color: "bg-indigo-400",
    },
    {
      title: "React.js",
      kind: "Front-end",
      percentage: "50",
      color: "bg-blue-400",
    },
    {
      title: "jQuery",
      kind: "Front-end",
      percentage: "70",
      description:
        "I am proficient in jQuery. I have used jQuery in many of my projects. I use the library for real-time element manipulation without the need for button clicks.",
      color: "bg-sky-400",
    },
    {
      title: "AJAX",
      kind: "Front-end",
      percentage: "60",
      description:
        "I have been using AJAX for some time now. I have used AJAX in two projects. I use the technology for dynamicAlly retrieving and saving data from the Database.",
      color: "bg-cyan-400",
    },
    {
      title: "PHP",
      kind: "Back-end",
      percentage: "70",
      description:
        "I am very proficient in PHP. I have used PHP for data retrieval, CRUD operations, functionalities, and more.",
      color: "bg-teal-400",
    },
    {
      title: "Laravel",
      kind: "Back-end",
      percentage: "50",
      description: "I develop projects at work using Laravel.",
      color: "bg-emerald-400",
    },
    {
      title: ".NET",
      kind: "Back-end",
      percentage: "60",
      description: "Having a good command of .NET, my level is advanced.",
      color: "bg-green-400",
    },
    {
      title: "ASP.NET",
      kind: "Back-end",
      percentage: "60",
      description: "I am good at ASP.NET. My level is advanced.",
      color: "bg-lime-400",
    },
    {
      title: "Java",
      kind: "Back-end",
      percentage: "30",
      description: "I know the basics of JAVA.",
      color: "bg-yellow-400",
    },
    {
      title: "MySQL",
      kind: "Database",
      percentage: "80",
      description:
        "I am fluent in MySQL. I have used MySQL in several projects. I am well versed in CRUD operations.",
      color: "bg-amber-400",
    },
    {
      title: "SQL",
      kind: "Database",
      percentage: "70",
      description:
        "I am fluent in SQL. I have used SQL in several projects. I am well versed in CRUD operations.",
      color: "bg-orange-400",
    },
    {
      title: "Git",
      kind: "Other",
      percentage: "60",
      color: "bg-red-400",
    },
    {
      title: "Power BI",
      kind: "Other",
      percentage: "60",
      color: "bg-pink-400",
    },
    {
      title: "Qlik Sense",
      kind: "Other",
      percentage: "70",
      color: "bg-rose-400",
    },
    {
      title: "Dynamics 365",
      kind: "Other",
      percentage: "60",
      color: "bg-purple-400",
    },
    {
      title: "Jira",
      kind: "Other",
      percentage: "90",
      color: "bg-fuchsia-400",
    },
  ],
};

export default data;
