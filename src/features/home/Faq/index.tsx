"use client";
import { ArrowCircle } from "@icons/ArrowCircle";
import { useState } from "react";

interface ILineItemProps {
  title: string;
  text: string;
}

const LineItem: React.FC<ILineItemProps> = ({ title, text }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen((isOpen) => !isOpen)}
      className="flex flex-wrap w-full p-10 mb-8 bg-slate-50 text-left border border-transparent hover:border-coolGray-200 rounded-md shadow-lg transition duration-200"
    >
      <div className="w-full md:w-3/4 lg:w-auto lg:pr-10">
        <h3 className="mb-4 text-xl  font-bold">{title}</h3>

        {isOpen && <p className="text-slate-500 font-medium">{text}</p>}
      </div>
      <div className="ml-auto">
        {isOpen ? <ArrowCircle /> : <ArrowCircle headDirection="bottom" />}
      </div>
    </button>
  );
};

const FAQ: React.FC = () => {
  return (
    <section
      className="py-20 bg-white"
      id="faq"
      style={{
        backgroundImage: 'url("images/elements/pattern-white.svg")',
        backgroundPosition: "center",
      }}
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-blue-500 bg-blue-100 font-medium rounded-full shadow-sm">
            FAQ
          </span>
          <h2 className="mb-4 text-4xl leading-tight font-bold tracking-tighter">
            Foire aux questions
          </h2>

          <p className="mb-16 text-lg text-slate-500 font-medium">
            Le succès de notre plateforme est étroitement lié à l'écoute et à
            l'intégration de vos retours. N'hésitez pas à partager vos
            expériences, vos suggestions d'amélioration ou toute question que
            vous pourriez avoir.{" "}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <LineItem
            title="Quels sont les formats de fichiers supportés ?"
            text='Nous supportons tous les formats de fichiers (DICOM, ZIP...). Vous
            pouvez uploader autant de fichiers que vous voulez, ils seront tous
            disponibles et téléchargeables dans la section "documents" de la
            page patient.'
          />
          <LineItem
            title="Comment partager des documents au sein de mon organisation / cabinet ?"
            text="Pour partager des documents au sein de votre cabinet, vous pouvez simplement inviter vos collaborateurs dans votre espace Medixi. Dès lors, ils auront accès à l'ensemble des dossiers des patients, comprenant les analyses et les comptes-rendus d'examens."
          />
          <LineItem
            title="Les informations de mes patients sont-elles sécurisées ?"
            text="La sécurité des informations de nos patients est notre priorité absolue. Nous utilisons des protocoles de sécurité de pointe pour protéger toutes les données saisies dans notre CRM. Cela comprend le chiffrement des données en transit et au repos, l'utilisation de réseaux sécurisés et la mise en œuvre de contrôles d'accès stricts pour s'assurer que seules les personnes autorisées peuvent accéder aux informations sensibles."
          />
          <LineItem
            title="Comment puis-je partager les résultats avec mes patients ?"
            text="Pour le moment, vous pouvez télécharger les comptes rendus depuis notre plateforme et les envoyer manuellement à vos patients. Nous prévoyons de lancer prochainement une fonctionnalité permettant l'envoi direct des résultats aux patients via la plateforme. Restez à l'écoute pour les mises à jour à venir."
          />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
