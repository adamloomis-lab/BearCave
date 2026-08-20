import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Swiper-based coverflow carousel for the project gallery.
// Adapted from the card-carousel pattern: stripped the demo chrome (badge,
// title, sparkle icon), removed the duplicate-image map (a bug in the source),
// swapped next/image for plain <img>, and added Swiper's A11y module.
// Card sizing + styling lives in src/index.css under .project-carousel.

interface ProjectCarouselProps {
  images: { src: string; alt: string }[];
  autoplayDelay?: number;
}

export default function ProjectCarousel({
  images,
  autoplayDelay = 4500,
}: ProjectCarouselProps) {
  return (
    <div className="project-carousel relative w-full">
      <Swiper
        spaceBetween={28}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={images.length > 2}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 120,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Autoplay, Pagination, A11y]}
        a11y={{
          prevSlideMessage: "Previous project",
          nextSlideMessage: "Next project",
          slideLabelMessage: "Project {{index}} of {{slidesLength}}",
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={image.src}>
            <figure className="relative w-full h-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
              <img
                src={image.src}
                alt={image.alt}
                loading={i < 3 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-steel-dark/85 via-steel-dark/55 to-transparent p-4 text-white text-sm font-medium leading-snug">
                {image.alt}
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
