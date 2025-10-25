import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

const Custom404: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <>
      <NavBar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <h1 className="text-white text-center text-5xl font-bold mt-8 mb-8">
          404 Page Not Found
        </h1>
        <Image
          src="https://app.svgator.com/assets/svgator.webapp/log-in-girl.svg"
          alt="Event Coming Soon"
          className="mx-auto mb-6 pb-6 sm:mb-0 rounded-lg"
          width={800}
          height={400}
        />
        <button
          onClick={handleGoHome}
          className="px-6 py-3 mt-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
        >
          Go Back to Home
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Custom404;
