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

const headerLinks = [
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
    title: "Projects",
    href: "/projects",
    icon: IconRocket,
  },
  {
    title: "Certifications",
    href: "/certifications",
    icon: IconStar,
  },
];

const socialLinks = [
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
];

const personalInfo = [
  {
    title: "Age",
    text: "25",
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
];

const educations = [
  {
    title: "Master",
    period: "02.2023 - 06.2024",
    degree: "Mobile and Web Technologies",
    institution: "University of Economics Varna",
    color: "bg-[#fff4f4]",
  },
  {
    title: "Bachelor",
    period: "09.2018 - 06.2022",
    degree: "Business Information System",
    institution: "University of Economics Varna",
    color: "bg-[#eef5fa]",
  },
  {
    title: "High School",
    period: "09.2013 - 05.2018",
    degree: "Sport Coach",
    institution: `Sport School "Georgi Benkovski" Varna`,
    color: "bg-[#eef5fa]",
  },
];

const experiences = [
  {
    title: "Backend web developer",
    period: "08.2023 - Present",
    location: "Varna",
    company: "MyPOS Technologies",
    color: "bg-[#fff4f4]",
  },
  {
    title: "Full stack web developer",
    period: "10.2022 - 07.2023",
    location: "Varna",
    company: "James IT Services",
    color: "bg-[#eef5fa]",
  },
  {
    title: "IT support & consultant",
    period: "04.2022 - 09.2022",
    location: "Varna",
    company: "ENERGO PRO",
    color: "bg-[#eef5fa]",
  },
  {
    title: "Manager in a small company",
    period: "04.2021 - 10.2021",
    location: "Varna",
    company: "Briella Ltd",
    color: "bg-[#fff4f4]",
  },
  {
    title: "Currency cashier",
    period: "04.2019 - 09.2019",
    location: "Golden Sands",
    company: "Edives Ltd",
    color: "bg-[#fff4f4]",
  },
  {
    title: "Tourism",
    period: "04.2018 - 09.2018",
    location: "Golden Sands",
    company: "Tourism",
    color: "bg-[#eef5fa]",
  },
];

const mainSkills = [
  {
    title: "Design",
    text: "I specialize in creating visually captivating and user-friendly designs that leave a lasting impression. Each design is meticulously crafted to align with every brand identity and meet specific goals.",
    icon: IconUIdesign,
    color: "bg-[#fff4f4]",
  },
  {
    title: "App Development",
    text: "With a passion for innovation and a keen eye for every detail, I specialize in creating exceptional applications that captivate. Through a collaborative and client-focused approach.",
    icon: IconAppDev,
    color: "bg-[#eef5fa]",
  },
  {
    title: "Management",
    text: "As an innovator, I bring a strategic mindset and hands-on approach to every project. I have experience leading small initiatives, ensuring seamless coordination and alignment with organizational goals.",
    icon: IconManagement,
    color: "bg-[#eef5fa]",
  },
  {
    title: "Web Development",
    text: "In today's, a strong online presence is essential businesses. As a developer, I specialize in creating user-centric web apps/systems/websites that not only attract attention but also deliver exceptional functionality.",
    icon: IconWebDev,
    color: "bg-[#fff4f4]",
  },
];

const techSkills = [
  {
    title: "HTML",
    percentage: "100",
    kind: "Frontend",
    description:
      "I am proficient in HTML and have utilized it extensively across numerous projects.",
    color: "bg-red-400",
  },
  {
    title: "CSS",
    kind: "Frontend",
    description:
      "I am excellent at CSS. I have used CSS in many projects. I am skilled in using grid and flexbox for positioning elements, and I also use CSS for animating elements.",
    percentage: "90",
    color: "bg-rose-400",
  },
  {
    title: "Tailwind",
    kind: "Frontend",
    description:
      "I am excellent at Tailwind. I have used Tailwind in many projects.",
    percentage: "90",
    color: "bg-pink-400",
  },
  {
    title: "Bootstrap",
    kind: "Frontend",
    description:
      "I am proficient in Bootstrap, having utilized it in one project.",
    percentage: "70",
    color: "bg-fuchsia-400",
  },
  {
    title: "JavaScript",
    kind: "Frontend",
    description:
      "I am proficient in JavaScript. I have used JavaScript in many of my projects. I use JS for animations, form validations, showing and hiding elements, and more.",
    percentage: "90",
    color: "bg-purple-400",
  },
  {
    title: "Vue.js",
    kind: "Frontend",
    percentage: "70",
    description:
      "I am proficient in Vue.js. I have used it in one of my professional projects.",
    color: "bg-violet-400",
  },
  {
    title: "Inertia.js",
    kind: "Frontend",
    percentage: "50",
    description:
      "My familiarity with Inertia.js stands at an intermediate level.",
    color: "bg-indigo-400",
  },
  {
    title: "React.js",
    kind: "Frontend",
    percentage: "80",
    description:
      "I possess a strong grasp of React.js and have utilized it proficiently.",
    color: "bg-blue-400",
  },
  {
    title: "Mobx",
    kind: "Frontend",
    percentage: "90",
    color: "bg-sky-400",
  },
  {
    title: "jQuery",
    kind: "Frontend",
    percentage: "80",
    description:
      "I am proficient in jQuery. I have used jQuery in many of my projects. I use the library for real-time element manipulation without the need for button clicks.",
    color: "bg-cyan-400",
  },
  {
    title: "AJAX",
    kind: "Frontend",
    percentage: "80",
    description:
      "I have been using AJAX for some time now. I have used AJAX in two projects. I use the technology for dynamically retrieving and saving data from the Database.",
    color: "bg-teal-400",
  },
  {
    title: "PHP",
    kind: "Backend",
    percentage: "80",
    description:
      "I am very proficient in PHP. I have used PHP for data retrieval, CRUD operations, functionalities, and more.",
    color: "bg-emerald-400",
  },
  {
    title: "Symfony",
    kind: "Backend",
    percentage: "70",
    description: "My proficiency in Symfony is at an intermediate level.",
    color: "bg-green-400",
  },
  {
    title: "Laravel",
    kind: "Backend",
    percentage: "70",
    description: "I develop projects at work using Laravel.",
    color: "bg-lime-400",
  },
  {
    title: "Next.js",
    kind: "Backend",
    percentage: "70",
    description:
      "I develop projects using Next.js extensively as part of my professional work.",
    color: "bg-lime-300",
  },
  {
    title: ".NET",
    kind: "Backend",
    percentage: "50",
    description: "Having a good command of .NET, my level is advanced.",
    color: "bg-yellow-400",
  },
  {
    title: "ASP.NET",
    kind: "Backend",
    percentage: "40",
    description: "I am good at ASP.NET. My level is advanced.",
    color: "bg-amber-400",
  },
  {
    title: "Java",
    kind: "Backend",
    percentage: "30",
    description: "I know the basics of JAVA.",
    color: "bg-orange-400",
  },
  {
    title: "MySQL",
    kind: "Database",
    percentage: "80",
    description:
      "I am fluent in MySQL. I have used MySQL in several projects. I am well versed in CRUD operations.",
    color: "bg-red-400",
  },
  {
    title: "SQL",
    kind: "Database",
    percentage: "70",
    description:
      "I am fluent in SQL. I have used SQL in several projects. I am well versed in CRUD operations.",
    color: "bg-pink-400",
  },
  {
    title: "MongoDB",
    kind: "Database",
    percentage: "70",
    description:
      "Fluent in MongoDB, I proficiently utilize it for database operations, excelling in CRUD functionalities.",
    color: "bg-pink-400",
  },
  {
    title: "Git",
    kind: "Other",
    percentage: "60",
    color: "bg-rose-400",
  },
  {
    title: "Power BI",
    kind: "Other",
    percentage: "60",
    color: "bg-purple-400",
  },
  {
    title: "Qlik Sense",
    kind: "Other",
    percentage: "70",
    color: "bg-fuchsia-400",
  },
  {
    title: "Dynamics 365",
    kind: "Other",
    percentage: "60",
    color: "bg-pink-400",
  },
  {
    title: "Jira",
    kind: "Other",
    percentage: "90",
    color: "bg-rose-400",
  },
];

const projects = {
  professional: [
    {
      name: "Web-based system for managing business processes related to payments.",
      technologies: [
        "HTML",
        "Twig",
        "CSS",
        "Bootstrap",
        "JavaScript",
        "jQuery",
        "React.js",
        "Mobx",
        "PHP",
        "Symfony",
        "MySQL",
      ],
      description:
        "This project consists of two components: a website and a user account system. Users can manage all processes related to payments received from their terminals through the account section, along with additional functionalities such as creating online stores with various products, issuing invoices to their clients through an innovative interface, and tracking all incoming funds in their account.",
    },
    {
      name: "Web-based system for buying and selling cars.",
      technologies: [
        "HTML",
        "CSS",
        "Tailwind",
        "JavaScript",
        "Vue.js",
        "Inertia.js",
        "PHP",
        "Laravel",
        "MySQL",
      ],
      description:
        "web-based platform designed to facilitate the process of buying and selling cars. It allows users to browse listings, post their vehicles for sale, and conduct secure transactions through the platform.",
    },
    {
      name: "Web based system for property valuation",
      technologies: [
        "HTML",
        "CSS",
        "Tailwind",
        "JavaScript",
        "Vue.js",
        "Inertia.js",
        "PHP",
        "Laravel",
        "MySQL",
      ],
      description:
        "The purpose of the trial is to allow residents to create appraisals that will be predicted by all interested parties and select the most appropriate appraiser to perform the task on the property. The selection of an evaluator is done anonymously, through a dynamic interface. The appraisal process begins with creating an appraisal, linking interested pages, inserting property data, and displaying appraisers through the interface. Once the appraiser is selected and the appraisals paid for, the process is complete. All communication about the process is done automatically through the platform, and the communication is visible to users. The platform supports multiple languages.",
    },
  ],
  personal: [
    {
      name: "Web based management system",
      technologies: [
        "HTML",
        "CSS",
        "Tailwind",
        "Framer Motion",
        "React.js",
        "Mobx",
        "Next.js",
        "MongoDB",
      ],
      description:
        "The Web-based management system is a comprehensive platform that allows users to place orders, monitor product availability, and manage their inventory effectively. Users can specify unique properties for each product, such as images, prices and etc. Additionally, the system includes features for adding sales and provides an innovative dashboard for tracking various statistics related to sales, turnovers, profits, expenses, and product inventory through insightful diagrams.",
    },
    {
      name: "System for job searching and offering - Job Portal",
      technologies: [
        "HTML",
        "CSS",
        "Tailwind",
        "Framer Motion",
        "React.js",
        "Mobx",
        "Next.js",
        "MongoDB",
      ],
      description:
        "The platform designed to connect employers with job seekers, providing functionalities for job searching and offering. Users can create accounts, distinguishing between employers and job seekers, to access the platform's features. Job seekers can browse through job listings, filtering by criteria such as location, salary, and industry, while employers can post job openings, specifying requirements and offered salary. The platform facilitates online job applications, allowing job seekers to submit their CVs and cover letters directly. Additionally, it may incorporate messaging features for communication between employers and job seekers and include a rating and review system for users to evaluate each other's experiences.",
    },
  ],
};

export {
  headerLinks,
  socialLinks,
  personalInfo,
  educations,
  experiences,
  mainSkills,
  techSkills,
  projects,
};
