import AppFeatures from "@features/home/AppFeatures";
import Banner from "@features/home/Banner";
import Contact from "@features/home/Contact";
import FAQ from "@features/home/Faq";
import Footer from "@features/home/Footer";
import React from "react";

export default async function Page() {
  return (
    <>
      <Banner />
      <AppFeatures />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
