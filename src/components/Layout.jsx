import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ProfileCard from "./ProfileCard";
import ChevronUp from "./../icons/ChevronUp";

const Layout = (props) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 300;

      if (scrollY > threshold) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className='w-full bg-blue-300 pb-8'
      style={{ backgroundImage: "url('/images/bg.jpg')" }}>
      <div className='lg:px-4 xl:px-32 2xl:px-64 flex gap-10 pt-40'>
        <ProfileCard />
        <div className='w-full'>
          <div className='flex justify-end'>
            <Header />
          </div>

          <div
            className={`lg:rounded-2xl bg-white pt-12 md:py-10 ${props.classes} shadow`}>
            {props.children}
            <Footer />
          </div>
        </div>
      </div>
      {showScrollButton && (
        <button
          className='hidden lg:flex w-10 h-10 fixed z-20 right-4 bottom-4 bg-gradient-to-r from-[#DD2476] to-[#fa5252ef] hover:from-[#fa5252ef] hover:to-[#DD2476] rounded-full justify-center items-center hover:opacity-80 transition-all cursor-pointer duration-500 text-white'
          onClick={scrollToTop}>
          <ChevronUp className='w-7 h-7' />
        </button>
      )}
    </div>
  );
};

export default Layout;
