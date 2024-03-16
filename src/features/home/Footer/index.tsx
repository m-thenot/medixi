"use client";
import { LinkButton } from "@components/Button";

const Footer: React.FC = () => {
  return (
    <section
      className="bg-white"
      style={{
        backgroundImage: 'url("images/elements/pattern-white.svg")',
        backgroundPosition: "center",
      }}
    >
      <div className="container px-4 mx-auto">
        <div className="pt-24 pb-11 mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center -mx-3 lg:-mx-6">
            <div className="w-full md:w-auto p-3 md:px-6">
              <LinkButton href="#features" size="large" variant="link">
                Fonctionnalités
              </LinkButton>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <LinkButton href="#prices" size="large" variant="link">
                Tarifs
              </LinkButton>
            </div>

            <div className="w-full md:w-auto p-3 md:px-6">
              <LinkButton href="#faq" size="large" variant="link">
                FAQ
              </LinkButton>
            </div>

            <div className="w-full md:w-auto p-3 md:px-6">
              <LinkButton href="#contact" size="large" variant="link">
                Contact
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-100" />
      <div className="container px-4 mx-auto">
        <p className="py-10 md:pb-20 text-sm text-slate-400 font-medium text-center">
          © 2024 Medixi. Tous droits réservés.
        </p>
      </div>
    </section>
  );
};

export default Footer;
