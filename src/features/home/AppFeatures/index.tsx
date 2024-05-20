import { App } from "@icons/App";
import { Email } from "@icons/Email";
import { Write } from "@icons/Write";

interface IFeatureProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  className?: string;
}

const Feature: React.FC<IFeatureProps> = ({
  icon,
  title,
  text,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap text-center md:text-left ${className}`}>
      <div className="w-full md:w-auto mb-6 md:mb-0 md:pr-6">
        <div className="inline-flex h-10 w-10 mx-auto items-center justify-center text-white bg-primary-100 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="w-full md:flex-1 md:pt-3">
        <div className="md:max-w-sm">
          <h3 className="mb-3 text-lg md:text-xl leading-tight font-bold">
            {title}
          </h3>
          <p className="text-slate-500 font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
};

const AppFeatures: React.FC = () => {
  return (
    <section
      className="relative py-20 bg-white overflow-hidden"
      id="features"
      style={{
        backgroundImage: 'url("images/elements/pattern-white.svg")',
        backgroundPosition: "center",
      }}
    >
      <div className="container px-4 mx-auto mb-16 md:mb-0">
        <div className="md:w-1/2 pl-4">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-primary-100 bg-blue-100 font-medium rounded-full shadow-sm">
            Application
          </span>
          <h3 className="mb-6 text-4xl leading-tight font-bold tracking-tighter">
            Une application pour vous simplifier la vie
          </h3>
          <p className="mb-12 text-lg text-slate-500 font-medium">
            A travers notre logiciel, nous avons pour mission de vous faciliter
            la gestion de votre patientèle et la collaboration avec vos équipes.
          </p>
          <Feature
            title="Téléchargez vos examens"
            text="Téléchargez de manière sécurisé les résultats d'examen de vos patients. Nous supportons tous les formats de fichiers (DICOM, zip...)"
            icon={<Email />}
            className="mb-10"
          />
          <Feature
            title="Rédigez vos rapports"
            text=" Rédigez les rapports pour vos patients directement sur notre plateforme."
            icon={<Write />}
            className="mb-10"
          />
          <Feature
            title="Gérez vos patients"
            text="Gérez les patients de votre cabinet à travers notre application."
            icon={<App />}
          />
        </div>
      </div>
      <div className="md:absolute md:top-28 lg:top-1/2 md:-right-96 xl:-right-80 md:-mr-56 lg:-mr-20 xl:-mr-0 md:transform lg:-translate-y-1/2 px-4 mb-16 md:mb-0">
        <div className="relative max-w-max">
          <img
            className="absolute p-7 -mt-1 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10/12 z-20"
            src="images/app-screenshot.png"
            alt=""
          />
          <img
            className="relative z-10"
            src="images/elements/macbook.png"
            alt=""
          />
          <img
            className="absolute -top-24 right-0 md:mt-px md:right-96 md:mr-52 lg:mr-16 xl:-mr-20 w-28 md:w-auto text-primary-100"
            src="images/elements/dots2-red.svg"
          />
          <img
            className="absolute -bottom-24 left-0 md:left-auto md:mt-px md:right-96 md:mr-52 lg:mr-16 xl:-mr-20 w-28 md:w-auto text-red-500"
            src="images/elements/dots2-red.svg"
          />
          <img
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-28 md:w-auto text-yellow-400"
            src="images/elements/circle2-violet.svg"
          />
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
