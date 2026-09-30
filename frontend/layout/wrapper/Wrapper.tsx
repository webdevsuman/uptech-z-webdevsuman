import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MuiTheme from "../../theme/MuiTheme";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MuiTheme>
        <Header />
        {children}
        <Footer />
      </MuiTheme>
    </>
  );
};

export default Wrapper;
