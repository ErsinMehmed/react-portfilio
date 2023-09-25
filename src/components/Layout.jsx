import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import ProfileCard from "./ProfileCard";
import ChevronUp from "./../icons/ChevronUp";

const Layout = (props) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 300
        ? setShowScrollButton(true)
        : setShowScrollButton(false);
    };

    window.addEventListener("scroll", handleScroll);
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className='w-full bg-blue-300 pb-12 lg:pb-8 bg-gradient-to-r from-purple-100 via-pink-50 to-pink-100'>
      <div className='lg:px-4 xl:px-32 2xl:px-64 lg:flex gap-10 pt-0.5 lg:pt-40'>
        <ProfileCard />

        <div className='w-full'>
          <div className='flex justify-end'>
            <Header />
            <MobileMenu />
          </div>

          <motion.div
            className={`lg:rounded-2xl bg-white py-8 lg:py-10 ${props.classes} shadow`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}>
            <h2 className='font-bold text-3xl sm:text-4xl text-slate-700 flex items-center'>
              {props.header}
              <div className='h-0.5 w-32 sm:w-44 ml-8 bg-gradient-to-r from-[#FA5252] to-[#DD2476] mt-1.5 rounded' />
            </h2>

            {props.children}
            <Footer />
          </motion.div>
        </div>
      </div>

      {showScrollButton && (
        <button
          className='hidden lg:flex w-10 h-10 fixed z-20 right-4 bottom-4 bg-gradient-to-r from-[#ffafbd] to-[#ffc3a0] hover:from-[#ffc3a0] hover:to-[#ffafbd] rounded-full justify-center items-center hover:opacity-80 transition-all duration-500 text-white'
          onClick={scrollToTop}>
          <ChevronUp className='w-7 h-7' />
        </button>
      )}
    </div>
  );
};

export default Layout;
