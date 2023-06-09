import Layout from "../components/Layout";
import data from "../Data";

const Home = () => {
  return (
    <Layout classes='px-6 md:px-10 lg:px-14'>
      <h2 className='font-bold text-4xl text-slate-700 flex items-center'>
        About Me
        <div className='h-0.5 w-44 ml-8 bg-gradient-to-r from-[#FA5252] to-[#DD2476] mt-1.5 rounded' />
      </h2>

      <div className='pt-5 w-full space-y-2.5 pr-10'>
        <p className='text-[#44566c] leading-7'>
          Hi, my name is Ersin and I am a software developer and sports coach. I
          have been programming for 3 1/2 years, both at university and in my
          spare time, and soon also at work.
        </p>

        <p className='text-[#44566c] leading-7'>
          I have theoretical and practical knowledge of back-end and front-end
          programming. My stronger side is web programming. You can find on this
          site more information about my developments and projects that I am
          working on.
        </p>
      </div>

      <h3 className='font-bold text-3xl text-slate-700 flex items-center mt-12 mb-5'>
        What I do!
      </h3>

      <div className='grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2'>
        {data.mainSkills.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex ${item.color} gap-4 rounded-xl p-6`}>
              <item.icon className='w-9 h-9 flex-shrink-0 mt-0.5' />
              <div className='space-y-2'>
                <h3 className='text-[23px] font-semibold text-slate-700'>
                  {item.title}
                </h3>

                <p className='text-[#44566C] text-[15px] text-justify'>
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
