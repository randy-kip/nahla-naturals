import React from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Head>
        <title>Nahla Naturals</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">
        {children} <Analytics />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
