import Image from "next/image";
import React from "react";
// import mongodb from "../../../public/mongodb.png"

const Courses = () => {
    const logos = [
        "mongodb.png",
        "node.png",
        "python.png",
        "Symbol.png",
        "tailwindcss.png",
        "ubuntu.png"
    ]
  return (
    <section className="bg-white py-12 overflow-hidden">
      <h2 className="text-center pb-5 text-2xl font-semibold mb-8">
        Courses we offer
      </h2>
    
      <div className="relative w-full overflow-hidden">
        <div className="flex marquee gap-16 min-w-[200%] whitespace-nowrap">
          {logos.concat(logos).map((logo, i) => (
            <Image
              key={i}
              src={`/images/${logo}`}
              width={150}
              height={150}
              alt="Client logo"
              className="h-15 object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
