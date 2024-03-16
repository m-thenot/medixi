import { EmailOpen } from "@icons/EmailOpen";
import { Phone } from "@icons/Phone";

const Contact: React.FC = () => {
  return (
    <section
      className="pt-10 bg-white"
      id="contact"
      style={{
        backgroundImage: 'url("images/elements/pattern-white.svg")',
        backgroundPosition: "center",
      }}
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-primary-100 bg-blue-100 font-medium uppercase rounded-9xl">
            Contact
          </span>
          <h3 className="mb-4 text-4xl leading-tight text-darkslate-900 font-bold tracking-tighter">
            Restons connectés
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            Vous avez besoin de plus de renseignements ? D'une offre
            personnalisée ? Envoyez-nous un message ou un email et nous vous
            répondrons dans les plus brefs délais !
          </p>
        </div>
        <div className="flex flex-wrap -mx-4 pb-16">
          <div className="w-full px-4 mb-10 md:mb-0 md:w-1/2">
            <div className="max-w-xs mx-auto text-center">
              <div className="inline-flex mb-5 items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
                <EmailOpen color="white" />
              </div>
              <h3 className="mb-2 text-xl md:text-2xl leading-9 text-slate-800 font-bold">
                Email
              </h3>
              <a
                className="text-lg text-slate-500 hover:text-slate-600 font-medium"
                href="mailto:#"
              >
                contact@medixi.com
              </a>
            </div>
          </div>
          <div className="w-full px-4 mb-10 md:mb-0 md:w-1/2">
            <div className="max-w-xs mx-auto text-center">
              <div className="inline-flex mb-5 items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
                <Phone color="white" />
              </div>
              <h3 className="mb-2 text-xl md:text-2xl leading-9 text-slate-800 font-bold">
                Téléphone
              </h3>
              <p className="text-lg text-slate-500 font-medium">
                +33 6 98 26 41 56
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-primary-100" />
    </section>
  );
};

export default Contact;
