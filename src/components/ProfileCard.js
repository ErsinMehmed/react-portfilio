import IconFacebook from "./../icons/Facebook";
import IconLinkedIn from "./../icons/LinkedIn";
import IconInstagram from "./../icons/Instagram";
import IconGitHub from "./../icons/GitHub";
import IconUser from "./../icons/User";
import IconLocation from "./../icons/Location";
import IconPhone from "./../icons/Phone";
import IconEmail from "./../icons/Email";
import IconSpeaker from "../icons/Speaker";
import IconDownload from "../icons/Download";

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
];

const handleDownload = () => {
  window.open("files/Ersin-Hyusein-CV.pdf", "_blank");
};

const ProfileCard = () => {
  return (
    <div className="lg:w-[350px] xl:w-96 hidden lg:block">
      <div className="w-full mb-6 lg:mb-0 mx-auto relative bg-white text-center px-6 rounded-[20px] mt-[180px] md:mt-[220px] lg:mt-0 shadow">
        <img
          src={"images/profile.jpg"}
          className="w-[240px] absolute left-[50%] transform -translate-x-[50%] h-[240px] drop-shadow-xl mx-auto rounded-[20px] -mt-[140px]"
          alt="profile"
        />

        <div className="pt-24 pb-8">
          <h2 className="mt-6 mb-1 text-slate-700 text-3xl font-semibold">
            Ersin Hyusein
          </h2>

          <h3 className="mb-4 text-[#7B7B7B] inline-block px-5 py-1.5 rounded-lg">
            Full Stack Web Developer
          </h3>

          <div className="flex justify-center space-x-3">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="w-10 h-10 flex items-center group justify-center rounded-lg bg-[#f3f6f6] hover:bg-gradient-to-r from-[#FA5252] to-[#DD2476] text-[#1773EA]">
                    <IconComponent />
                  </span>
                </a>
              );
            })}
          </div>

          <div className="px-7 py-6 rounded-2xl mt-7 bg-[#F3F6F6]">
            {personalInfo.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${
                    index === personalInfo.length - 1
                      ? ""
                      : "border-b border-gray-200"
                  } py-2.5`}
                >
                  <span
                    className={`w-10 h-10 flex items-center justify-center rounded-lg bg-white ${item.iconColor} shadow-md`}
                  >
                    <item.icon className="w-5 h-5" />
                  </span>

                  <div className="text-left ml-2.5 font-semibold text-slate-800">
                    <p className="text-xs text-slate-500">{item.title}</p>

                    {index === 2 || index === 3 ? (
                      <a
                        className="hover:underline transition-all"
                        href={
                          index === 2
                            ? "tel:+359 899 626273"
                            : "mailto:ersin99mehmed@abv.bg"
                        }
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p>{item.text}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="mx-auto flex items-center text-xl font-semibold rounded-3xl mt-6 bg-gradient-to-r from-[#DD2476] to-[#fa5252ef] hover:from-[#fa5252ef] hover:to-[#DD2476] px-10 py-3 text-white active:scale-95 transition-all"
            onClick={handleDownload}
          >
            <IconDownload className="w-6 h-6 mr-2 mt-1" />
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
