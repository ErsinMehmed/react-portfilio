import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
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
    <div className='w-full bg-blue-300 pb-8 bg-gradient-to-r from-purple-200 via-pink-100 to-pink-200'>
      <motion.div
        className='lg:px-4 xl:px-32 2xl:px-64 flex gap-10 pt-40'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <ProfileCard />

        <div className='w-full'>
          <div className='flex justify-end'>
            <Header />
          </div>

          <motion.div
            className={`lg:rounded-2xl bg-white pt-12 md:py-10 ${props.classes} shadow`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}>
            {props.children}
            <Footer />
          </motion.div>
        </div>
      </motion.div>

      {showScrollButton && (
        <button
          className='hidden lg:flex w-10 h-10 fixed z-20 right-4 bottom-4 bg-gradient-to-r from-[#DD2476] to-[#fa5252ef] hover:from-[#fa5252ef] hover:to-[#DD2476] rounded-full justify-center items-center hover:opacity-80 transition-all duration-500 text-white'
          onClick={scrollToTop}>
          <ChevronUp className='w-7 h-7' />
        </button>
      )}
    </div>
  );
};

export default Layout;
