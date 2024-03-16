"use client";
import Button, { LinkButton } from "@components/Button";
import OfflineHeader from "@components/OfflineHeader";
import { useState } from "react";

const Banner: React.FC = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <section
      className="relative bg-white overflow-hidden"
      style={{
        backgroundImage: 'url("images/elements/pattern-white.svg")',
        backgroundPosition: "center",
      }}
    >
      <OfflineHeader
        isSignUpModalOpen={isSignUpModalOpen}
        setIsSignUpModalOpen={setIsSignUpModalOpen}
      />
      <div className="py-20 md:py-28">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap xl:items-center -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-16 md:mb-0">
              <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-blue-500 uppercase rounded-full">
                Sénégal
              </span>
              <h1 className="mb-6 text-3xl md:text-5xl leading-tight font-bold tracking-tight">
                Connectez, analysez, et partagez en toute sécurité
              </h1>
              <p className="mb-8 text-lg text-slate-500 font-medium">
                Simplifiez votre pratique radiologique avec une solution
                tout-en-un : téléchargez les résultats de vos patients et
                rédigez vos comptes rendus, dans un environnement sécurisé.
              </p>
              <div className="flex flex-wrap">
                <div className="w-full md:w-auto py-1 md:py-0 md:mr-4">
                  <Button
                    onClick={() => setIsSignUpModalOpen(true)}
                    variant="primary"
                    size="xlarge"
                  >
                    S'inscrire
                  </Button>
                </div>
                <div className="w-full md:w-auto py-1 md:py-0">
                  <LinkButton href="#contact" variant="secondary" size="xlarge">
                    Nous contacter
                  </LinkButton>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <div className="relative mx-auto md:mr-0 max-w-max">
                <img
                  className="absolute z-10 -left-14 -top-12 w-28 md:w-auto"
                  src="images/elements/circle3-violet.svg"
                  alt=""
                />
                <img
                  className="absolute z-10 -right-7 -bottom-8 w-28 md:w-auto"
                  src="images/elements/dots3-red.svg"
                  alt=""
                />
                <img
                  className="relative rounded-lg"
                  src="images/banner.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
