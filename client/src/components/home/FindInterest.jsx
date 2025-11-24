import { homeInterest } from "@/lib/data";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const FindInterest = () => {
  return (
    <section>
      <div className="container max-[600px]:pr-0 pb-6 pt-8">
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          loop={true}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 10,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {homeInterest.map((item) => (
            <SwiperSlide key={item.id}>
              <Link
                to={`/listings?category=${item.category.toLowerCase()}`}
                className="relative block rounded-xl overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  className="w-full h-auto md:h-60 lg:h-70 object-cover rounded-lg"
                />
                <span className="w-full inline-block bottom-0 absolute h-28 bg-linear-to-t  from-black/70 via-black/80  to-transparent"></span>
                <p className="text-white text-xl max-[460px]:text-base max-[500px]:text-lg absolute bottom-4 left-4 font-black">
                  {item.category}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
export default FindInterest;
