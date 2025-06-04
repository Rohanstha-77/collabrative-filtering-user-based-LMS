"use client"
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AuthContext } from "@/context/auth-context";
import { getRecommendationService } from "@/services";
import { useContext, useEffect, useState } from "react";

export function CourseCarousel() {
  // Dummy data for recommendations
  const recommendations = [
    {
      id: 1,
      title: "Product 1",
      price: "$99.99",
      rating: 4.5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Product 2",
      price: "$149.99",
      rating: 4.8,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Product 3",
      price: "$259.99",
      rating: 4.2,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      title: "Product 4",
      price: "$79.99",
      rating: 4.0,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      title: "Product 5",
      price: "$199.99",
      rating: 4.7,
      image: "https://via.placeholder.com/150",
    },
  ];

  const {auth} = useContext(AuthContext)
  // const [courseId, setCourseId] = useState(null)

  const [storeRecommendation, setStoreRecommendation] = useState(null);
  // console.log(auth)

  const getRecommendation = async () => {
      console.log("Fetching recommendations for user:", auth?.user?._id);
      try {
        const response = await getRecommendationService(auth?.user?._id);
        console.log("API Response:", response);
        if (response?.success) {
          setStoreRecommendation(response.data); // Update the state
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error while fetching recommendations:", error);
      }
    };

  useEffect(() => {
    getRecommendation();  
}); // Dependency array ensures effect runs when user ID changes

  console.log("Store Recommendation:", storeRecommendation);


  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Recommended for You
      </h2>

      <Carousel
        opts={{
          align: "start",
        }}
        className=" ml-10 w-[95%]"
      >
        <CarouselContent>
          {recommendations.map((item) => (
            <CarouselItem
              key={item.id}
              className="md:basis-1/2 lg:basis-1/3 p-2"
            >
              {
                storeRecommendation.length > 0 ? (
                  <div>
                    {storeRecommendation.map(item => (
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        {/* Image */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />

                        {/* Title */}
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          {item.title}
                        </h3>

                        {/* Pricing */}
                        <p className="text-lg font-bold text-gray-800 mb-2">
                          {item.price}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={
                                  index < Math.floor(item.rating)
                                    ? "currentColor"
                                    : "none"
                                }
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {item.rating.toFixed(1)} / 5
                          </span>
                        </div>

                        {/* View Details Button */}
                        <button className="w-full px-4 py-2 bg-[#4F46E5] text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                ) : <h1>No Recommndation for you</h1>
              }
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}