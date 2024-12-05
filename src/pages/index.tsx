import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/nav"; 
import Footer from "@/components/footar";

const Typewriter = ({ text, speed }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed || 100);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <span>{displayedText}</span>;
};

const Home = () => {
  const router = useRouter();

  const eventsClick = () => {
    router.push("/ourevents");
  };

  return (
    <>
      <NavBar />
      <main
        className="flex h-[100vh] bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('/assets/Thapathali.jpg')` }} // Ensure image is in the public folder
      >
        <div className="static p-2 text-white flex flex-col w-full h-full justify-evenly items-center z-10 backdrop-blur-sm backdrop-brightness-50 bg-no-repeat bg-cover">
        <div className="relative p-6 rounded-lg text-9xl">
          <h1
            className="text-6xl sm:text-9xl lg:text-10xl font-extralight tracking-wide hover:bg-white hover:text-yellow-500 transition-all duration-300"
            style={{
              animation: "gradientText 5s ease-in-out infinite, fadeToWhite 6s ease-in-out infinite 5s",
              backgroundSize: "200% 200%",
              backgroundImage: "linear-gradient(90deg, gray, white)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent", // Make sure text color is transparent for the gradient
            }}
          >
            
            ECAST
          </h1>
          </div>
          <h2 className="lg:text-xl text-center lg:text-left font-mono">
            "Electronics and Computer Community Amidst Students, Thapathali"
            <br />
            <span className="block text-center">
              <Typewriter text='"Connecting the brightest young minds in Engineering"' speed={50} />
            </span>
          </h2>
          <div className="sm:flex-row flex flex-col lg:w-[50%] w-[auto] justify-center gap-8 mb-4">
            <button
              className="px-6 py-4 bg-white text-black font-bold rounded hover:bg-yellow-500 hover:text-white transition duration-300"
              onClick={eventsClick}
            >
              Our Events
            </button>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/4n8rquAp5H"
            >
              <button className="px-6 py-4 bg-transparent text-white hover:text-yellow-500 hover:bg-white transition duration-500 border-2 border-white font-bold rounded">
                Join Our Discord
              </button>
            </a>
          </div>
        </div>
      </main>

      {/* Inline Style for Animations */}
      <style jsx>{`
        @keyframes gradientText {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fadeToWhite {
          0% {
            color: transparent;
          }
          100% {
            color: transparent;
          }
        }
      `}</style>

      <Footer />
    </>
  );
};

export default Home;
