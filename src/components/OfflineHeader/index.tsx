"use client";
import Button, { LinkButton } from "@components/Button";
import Modal from "@components/Modal";
import { Close } from "@icons/Close";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

const links = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#prices", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

interface IOfflineHeaderProps {
  setIsSignUpModalOpen: Dispatch<SetStateAction<boolean>>;
  isSignUpModalOpen: boolean;
}

const OfflineHeader: React.FC<IOfflineHeaderProps> = ({
  setIsSignUpModalOpen,
  isSignUpModalOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const router = useRouter();

  return (
    <>
      <nav className="flex justify-between p-6 px-4 sm:px-8">
        <div className="flex justify-between items-center w-full">
          <div className="w-1/2 lg:w-1/3">
            <a className="block max-w-max" href="/">
              <img className="h-8" src="images/logo.png" alt="" />
            </a>
          </div>
          <div className="w-1/2 lg:w-1/3">
            <ul className="hidden lg:flex lg:justify-center">
              {links.map((link) => (
                <li className="mr-12" key={link.href}>
                  <LinkButton href={link.href} variant="link" size="small">
                    {link.label}
                  </LinkButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 lg:w-1/3">
            <div className="hidden lg:flex items-center justify-end">
              <Button
                onClick={async () => {
                  router.push(`/api/auth/login?post_login_redirect_url=/`);
                }}
                variant="link"
                size="small"
                className="mr-6"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => setIsSignUpModalOpen(true)}
                variant="primary"
                size="small"
                className="mr-2"
              >
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
        <button
          className="self-center lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <svg
            width={35}
            height={35}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="text-slate-50"
              width={32}
              height={32}
              rx={6}
              fill="currentColor"
            />
            <path
              className="text-slate-500"
              d="M7 12H25C25.2652 12 25.5196 11.8946 25.7071 11.7071C25.8946 11.5196 26 11.2652 26 11C26 10.7348 25.8946 10.4804 25.7071 10.2929C25.5196 10.1054 25.2652 10 25 10H7C6.73478 10 6.48043 10.1054 6.29289 10.2929C6.10536 10.4804 6 10.7348 6 11C6 11.2652 6.10536 11.5196 6.29289 11.7071C6.48043 11.8946 6.73478 12 7 12ZM25 15H7C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16C6 16.2652 6.10536 16.5196 6.29289 16.7071C6.48043 16.8946 6.73478 17 7 17H25C25.2652 17 25.5196 16.8946 25.7071 16.7071C25.8946 16.5196 26 16.2652 26 16C26 15.7348 25.8946 15.4804 25.7071 15.2929C25.5196 15.1054 25.2652 15 25 15ZM25 20H7C6.73478 20 6.48043 20.1054 6.29289 20.2929C6.10536 20.4804 6 20.7348 6 21C6 21.2652 6.10536 21.5196 6.29289 21.7071C6.48043 21.8946 6.73478 22 7 22H25C25.2652 22 25.5196 21.8946 25.7071 21.7071C25.8946 21.5196 26 21.2652 26 21C26 20.7348 25.8946 20.4804 25.7071 20.2929C25.5196 20.1054 25.2652 20 25 20Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </nav>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        }  fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 z-40`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 z-50 left-0 bottom-0 duration-300 transform transition-transform w-4/5 max-w-xs bg-white ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <nav className="relative p-6 h-full overflow-y-auto">
          <div className="flex flex-col justify-between h-full">
            <a className="inline-block" href="/">
              <img className="h-8" src="images/logo.png" alt="" />
            </a>
            <ul className="py-6">
              {links.map((link) => (
                <li key={link.href} className="mb-4">
                  <LinkButton href={link.href} variant="link" size="large">
                    {link.label}
                  </LinkButton>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap">
              <Button
                onClick={async () => {
                  router.push(`/api/auth/login?post_login_redirect_url=/`);
                }}
                variant="link"
                size="large"
                className="w-full mb-4 text-center"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => setIsSignUpModalOpen(true)}
                variant="primary"
                size="large"
                className="w-full"
              >
                S'inscrire
              </Button>
            </div>
          </div>
        </nav>
        <button
          className="absolute top-5 p-4 right-3"
          onClick={() => setIsOpen(false)}
        >
          <Close width={12} height={12} color="#556987" />
        </button>
      </div>
      {isSignUpModalOpen && (
        <Modal onClose={() => setIsSignUpModalOpen(false)}>
          <div className="max-w-md mx-auto bg-slate-50 rounded-lg">
            <p className="mb-2">
              Commencez par créer gratuitement votre organisation. Il s'agit
              généralement de votre cabinet médical, clinique, ou autre
              établissement de soins.
            </p>
            <p className="mb-4">
              Une fois votre organisation créée, vous aurez la possibilité
              d'ajouter d'autres collaborateurs, leur permettant ainsi d'accéder
              et de contribuer au système.
            </p>
            <div className="w-full mb-8">
              <label
                className="block mb-2 text-slate-800 font-medium leading-6"
                htmlFor="organization"
              >
                Nom de votre organisation
              </label>
              <input
                className="block h-12 w-full py-2 px-3 appearance-none border border-slate-200 rounded-lg shadow-md leading-6 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-opacity-50"
                type="text"
                name="organization"
                placeholder="Cabinet du Dr FALL"
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <Button
              size="large"
              disabled={orgName === ""}
              onClick={() =>
                router.push(`/api/auth/create_org?org_name=${orgName}`)
              }
              className="w-full"
            >
              Créer mon compte gratuitement
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OfflineHeader;
