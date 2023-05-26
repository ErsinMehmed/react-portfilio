import Header from "./Header";
import Footer from "./Footer";
import ProfileCard from "./ProfileCard";

const Layout = (props) => {
  return (
    <div
      className="w-full bg-blue-300 pb-8"
      style={{ backgroundImage: "url('/images/bg.jpg')" }}
    >
      <div className="lg:px-4 xl:px-32 2xl:px-64 flex gap-10 pt-40">
        <ProfileCard />
        <div className="w-full">
          <div className="flex justify-end">
            <Header />
          </div>

          <div
            className={`lg:rounded-2xl bg-white pt-12 md:py-10 ${props.classes} shadow`}
          >
            {props.children}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
