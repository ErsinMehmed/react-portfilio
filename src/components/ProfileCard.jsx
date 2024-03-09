import IconDownload from "../icons/Download";
import { socialLinks, personalInfo } from "../Data";

const ProfileCard = () => {
  const handleDownload = () => {
    window.open("files/Ersin-Hyusein-CV.pdf", "_blank");
  };

  return (
    <div className='lg:sticky top-44'>
      <div className='w-full mb-6 lg:mb-0 mx-auto relative bg-white text-center px-8 lg:rounded-[20px] mt-40 sm:mt-44 md:mt-56 lg:mt-0 shadow'>
        <img
          src={"images/profile.png"}
          className='w-56 h-56 sm:w-60 sm:h-60 absolute left-[50%] transform -translate-x-[50%] drop-shadow-xl mx-auto rounded-[20px] -mt-[140px]'
          alt='profile'
        />

        <div className='pt-24 pb-8'>
          <h2 className='mt-6 mb-1 text-slate-700 text-2xl sm:text-3xl font-semibold'>
            Ersin Hyusein
          </h2>

          <h3 className='mb-4 text-gray-600 inline-block px-5 py-1.5 rounded-lg'>
            Web Developer
          </h3>

          <div className='flex justify-center space-x-3'>
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;

              return (
                <a
                  key={index}
                  href={link.href}
                  target='_blank'
                  rel='noreferrer'>
                  <span className='w-10 h-10 flex items-center group justify-center rounded-lg bg-[#f3f6f6] hover:bg-gradient-to-r from-[#ffafbd] to-[#ffc3a0] text-[#1773EA]'>
                    <IconComponent />
                  </span>
                </a>
              );
            })}
          </div>

          <div className='p-6 rounded-2xl mt-7 bg-[#F3F6F6]'>
            {personalInfo.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  index === personalInfo.length - 1
                    ? ""
                    : "border-b border-gray-200"
                } py-2.5`}>
                <span
                  className={`w-10 h-10 flex items-center justify-center rounded-lg bg-white ${item.iconColor} shadow-md`}>
                  <item.icon className='w-5 h-5' />
                </span>

                <div className='text-left ml-2.5 font-semibold text-slate-800'>
                  <p className='text-sm text-slate-600'>{item.title}</p>

                  {index === 2 || index === 3 ? (
                    <a
                      className='hover:underline transition-all text-sm'
                      href={
                        index === 2
                          ? "tel:+359 899 626273"
                          : "mailto:ersin99mehmed@abv.bg"
                      }>
                      {item.text}
                    </a>
                  ) : (
                    <p className='text-sm'>{item.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type='button'
            className='mx-auto flex items-center sm:text-xl font-semibold rounded-3xl mt-5 sm:mt-6 bg-gradient-to-r from-[#ffafbd] to-[#ffc3a0] hover:from-[#ffc3a0] hover:to-[#ffafbd] px-8 sm:px-10 py-2 sm:py-3 text-white active:scale-95 transition-all'
            onClick={handleDownload}>
            <IconDownload className='w-6 h-6 mr-2 mt-0.5 sm:mt-1' />
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
