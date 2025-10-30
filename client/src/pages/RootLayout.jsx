import Footer from "@/components/global/Footer";
import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <Header />
      <main className="content-height">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default RootLayout;
