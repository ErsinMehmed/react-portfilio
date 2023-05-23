import Layout from "./../components/Layout";
import IconUIdesign from "./../icons/UIdesign";
import IconAppDev from "./../icons/AppDev";
import IconManagement from "./../icons/Management";
import IconWebDev from "./../icons/WebDev";

const skills = [
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
];

const Home = () => {
  return (
    <Layout classes="px-6 md:px-10 lg:px-14">
      <h2 className="font-bold text-4xl text-slate-700 flex items-center">
        About Me
        <div className="h-0.5 w-44 ml-8 bg-gradient-to-r from-[#FA5252] to-[#DD2476] mt-1.5 rounded"></div>
      </h2>

      <div className="pt-5 w-full space-y-2.5 pr-10">
        <p className="text-[#44566c] leading-7">
          Hi, my name is Ersin and I am a software developer and sports coach. I
          have been programming for 3 1/2 years, both at university and in my
          spare time, and soon also at work.
        </p>
        <p className="text-[#44566c] leading-7">
          I have theoretical and practical knowledge of back-end and front-end
          programming. My stronger side is web programming. You can find on this
          site more information about my developments and projects that I am
          working on.
        </p>
      </div>

      <h3 className="font-bold text-3xl text-slate-700 flex items-center mt-12 mb-5">
        What I do!
      </h3>

      <div className="grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
        {skills.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex ${item.color} gap-4 rounded-xl p-6`}
            >
              <item.icon className="w-9 h-9 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-[23px] font-semibold text-slate-700">
                  {item.title}
                </h3>
                <p className="text-[#44566C] text-[15px] text-justify">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Home;

