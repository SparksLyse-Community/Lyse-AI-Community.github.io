import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);
  const mobileNavbarVariants = {
    open: {
      opacity: 1,
      x: 0,
    },
    closed: {
      opacity: 0,
      x: "100%",
    },
  };

  return (
    <nav className="sticky top-0 z-60 w-full max-w-full overflow-x-clip border-b border-white/5 bg-[#0a0a0a]/80 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-8">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-between
        "
      >
        <a
          href={`${import.meta.env.BASE_URL}#hero`}
          className="
            flex
            shrink-0
            items-center
            gap-2
            text-white
            transition-opacity
            hover:opacity-80
          "
        >
          <svg
            className="h-6 w-6"
            role="presentation"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.65 10.849L.485 8.946C.194 8.839 0 8.561 0 8.25s.194-.589.485-.697L5.65 5.65 7.553.485C7.661.194 7.939 0 8.25 0s.589.194.697.485L10.849 5.65l5.165 1.903c.292.108.486.386.486.697s-.194.589-.486.697l-5.165 1.903-1.903 5.165c-.108.292-.386.485-.697.485s-.589-.193-.697-.485L5.65 10.849Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              transform="translate(2.25 5.25)"
            />

            <path
              d="M16.5 1.5v4.5M21 6.75v3M14.25 3.75h4.5M19.5 8.25h3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>

          <span
            className="
              text-lg
              font-bold
              tracking-wide
            "
          >
            SparksLyse
          </span>
        </a>

        <div
          className="
            hidden
            items-center
            gap-6

            md:flex
            lg:gap-8
          "
        >
          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}#about`}
            rel="noreferrer"
          >
            A propos
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}train`}
            rel="noreferrer"
          >
            Entraînement
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}equipe`}
            rel="noreferrer"
          >
            Equipe
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}#faq`}
          >
            FAQ
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}#soutien`}
          >
            Soutenir le projet
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}blog`}
          >
            Blog
          </Button>
        </div>

        <Button variant="button-red" href={`${import.meta.env.BASE_URL}chat`}>
          Commencer
        </Button>

        <Button
          id="mobile-menu-button"
          type="button"
          size="lg"
          aria-label={isMobileNavbarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileNavbarOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileNavbarOpen(!isMobileNavbarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
        >
          {isMobileNavbarOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12" /> <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            >
              <path d="M4 6h16" /> <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </Button>
      </div>
      <motion.div
        animate={isMobileNavbarOpen ? "open" : "closed"}
        variants={mobileNavbarVariants}
        id="mobile-menu"
        className="absolute left-0 right-0 top-full z-40 w-full max-w-full overflow-hidden md:hidden bg-[#0a0a0a]"
      >
        <div className="flex flex-col gap-1 border-t border-white/5 w-[90%] pb-3 pt-3">
          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}#about`}
            rel="noreferrer"
            className="rounded-lg"
          >
            A propos
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}train`}
            rel="noreferrer"
            className="rounded-lg"
          >
            Entraînement
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}equipe`}
            rel="noreferrer"
            className="rounded-lg"
          >
            Equipe
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}#faq`}
            className="rounded-lg"
          >
            FAQ
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}#soutien`}
            className="rounded-lg"
          >
            Soutenir le projet
          </Button>

          <Button
            variant="link"
            size="lg"
            href={`${import.meta.env.BASE_URL}blog`}
            className="rounded-lg"
          >
            Blog
          </Button>

          <Button
            variant="button-red"
            className="bg-[#dba0a0]/10! hover:bg-[#dba0a0]/20!"
            href={`${import.meta.env.BASE_URL}chat`}
          >
            Commencer
          </Button>
        </div>
      </motion.div>
    </nav>
  );
}
