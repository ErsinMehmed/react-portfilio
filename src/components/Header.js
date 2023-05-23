import { Link, useLocation } from "react-router-dom";
import IconUser from "./../icons/User";
import IconRocket from "./../icons/Rocket";
import IconStar from "./../icons/Star";
import IconDocument from "./../icons/Document";

const items = [
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
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-fit h-fit hidden lg:block p-5 mb-8 rounded-2xl bg-white shadow">
      <nav className="hidden lg:block">
        <ul className="flex">
          {items.map((item) => {
            return (
              <li key={item.href}>
                <Link
                  className={`${
                    location.pathname === item.href
                      ? "text-white bg-gradient-to-r from-[#FA5252] to-[#DD2476]"
                      : "text-slate-800 hover:text-white hover:bg-gradient-to-r from-[#FA5252] to-[#DD2476] transition-all bg-[#f3f6f6]"
                  } w-[85px] h-[85px] flex items-center justify-center mx-2.5 rounded-lg text-[13px] font-semibold shadow`}
                  to={item.href}
                >
                  <div className="text-center">
                    <item.icon outline="false" />
                    {item.title}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

