import {
  BiLogoFacebookSquare,
  BiLogoInstagram,
  BiLogoPinterest,
} from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="bg-[#222] py-8">
      <div className="container flex items-center justify-between flex-col sm:flex-row gap-6">
        {/*Footer content left*/}
        <div className="text-sm text-muted-foreground flex items-center gap-8 flex-col sm:flex-row">
          <div className="flex items-center gap-8 ">
            <a href="#" className="hover:text-white">
              Buy
            </a>
            <a href="#" className="hover:text-white">
              Rent
            </a>
            <a href="#" className="hover:text-white">
              Blog
            </a>
          </div>
          <p className="">
            &copy; {new Date().getFullYear()} PropOne. All rights reserved.
          </p>
        </div>
        {/*Footer content right*/}
        <div className="flex items-center gap-4 text-white text-xl">
          <a href="#" className="hover:text-accent">
            <BiLogoFacebookSquare />
          </a>
          <a href="#" className="hover:text-accent">
            <BiLogoInstagram />
          </a>
          <a href="#" className="hover:text-accent">
            <BiLogoPinterest />
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
