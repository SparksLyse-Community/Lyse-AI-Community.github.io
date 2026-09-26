import { useRef, useState } from "react";
import type { ImageMetadata } from "astro";

import featureImage1 from "../assets/images/feature1.jpg";
import featureImage2 from "../assets/images/feature2.jpg";
import featureImage3 from "../assets/images/feature3.jpg";
import featureImage4 from "../assets/images/feature4.jpg";

export default function FeatureSlider() {
  const features: {
    title: string;
    description: string;
    image: ImageMetadata;
  }[] = [
    {
      title: "Création de contenu",
      description: "Demandez-lui des stories, posts, et idées",
      image: featureImage1,
    },
    {
      title: "Aide au codage",
      description: "Résolvez les problèmes de votre code",
      image: featureImage2,
    },
    {
      title: "Recherche",
      description: "Recherchez les infos importantes",
      image: featureImage3,
    },
    {
      title: "Productivité",
      description: "Restez concentré avec votre assistant",
      image: featureImage4,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.clientWidth;
      const newIndex = Math.round(
        scrollContainerRef.current.scrollLeft / slideWidth,
      );
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <div>
      <div
        className="
          flex
          w-full
          overflow-x-auto
          border-b
          border-white/10
          text-white/45
          scrollbar-none
        "
        role="tablist"
        aria-label="Fonctionnalités"
      >
        {features.map((feature, idx) => {
          const isActive = idx === activeIndex;

          return (
            <button
              key={feature.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => scrollToSlide(idx)}
              className={`
                relative
                shrink-0
                cursor-pointer
                whitespace-nowrap
                px-3
                py-3
                text-sm
                transition-colors
                duration-200

                sm:px-4
                sm:text-base

                md:px-5

                ${isActive ? "text-white" : "hover:text-white"}

                after:absolute
                after:-bottom-px
                after:left-0
                after:h-0.5
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-white
                after:transition-transform
                after:duration-200

                ${isActive ? "after:scale-x-100" : ""}
              `}
            >
              {feature.title}
            </button>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="
            flex
            w-full
            snap-x
            snap-mandatory
            overflow-x-auto
            scroll-smooth
            scrollbar-none
          "
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                w-full
                shrink-0
                snap-center
                px-0.5
              "
            >
              <article
                className="
                  flex
                  w-full
                  flex-col
                  gap-6
                  rounded-2xl
                  border
                  border-white/5
                  bg-white/2.5
                  p-4
                  transition
                  hover:border-white/10
                  hover:bg-white/4.5

                  sm:p-6

                  md:flex-row
                  md:items-center
                  md:gap-8
                  md:p-8

                  lg:p-9
                "
              >
                <div
                  className="
                    w-full
                    shrink-0
                    overflow-hidden
                    rounded-xl

                    md:w-[45%]
                    lg:w-[48%]
                  "
                >
                  <img
                    src={feature.image.src}
                    alt={feature.title}
                    width={516}
                    height={396.8}
                    loading="lazy"
                    className="
                      block
                      h-auto
                      w-full
                      rounded-xl
                      object-cover
                      transition-transform
                      duration-500
                      hover:scale-[1.02]
                    "
                  />
                </div>

                <div
                  className="
                    flex
                    min-w-0
                    w-full
                    flex-col
                    items-start
                    md:flex-1
                  "
                >
                  <p
                    className="
                      mb-2
                      text-lg
                      text-[#858585]

                      sm:text-xl
                    "
                  >
                    {feature.title}
                  </p>

                  <p
                    className="
                      mb-6
                      max-w-md
                      text-base
                      leading-7
                      text-white

                      sm:mb-8
                      sm:text-lg

                      lg:text-xl
                    "
                  >
                    {feature.description}
                  </p>

                  <a
                    href={`${import.meta.env.BASE_URL}#final-cta`}
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-sm
                      text-[#e8ff9c]
                      transition-opacity
                      hover:opacity-70
                    "
                  >
                    Commencer
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
