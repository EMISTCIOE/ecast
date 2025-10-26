import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

interface CardProps {
  imgSrc: string;
  name: string;
  pos: string;
  linkedin: string;
  github: string;
}

const Card: React.FC<CardProps> = ({ imgSrc, name, pos, linkedin, github }) => {
  return (
    <div className="p-6 w-80 h-[420px] bg-black hover:bg-black/90 border-2 border-[#3b340d] hover:border-yellow-400 rounded-xl flex flex-col items-center justify-between transition duration-500">
      {/* Image container with fixed dimensions */}
      <div className="w-48 h-48 relative flex-shrink-0">
        <Image
          className="rounded-full object-cover"
          src={imgSrc}
          alt="Team Member"
          fill
          sizes="192px"
        />
      </div>

      {/* Text container with flex-grow to take available space */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-2">
        {/* Name with yellow color */}
        <h1 className="text-2xl mt-3 mb-2 text-yellow-500 text-center line-clamp-2 w-full break-words leading-tight">
          {name}
        </h1>
        {/* Position */}
        <h1 className="text-base text-white text-center line-clamp-2 w-full break-words leading-snug">
          {pos}
        </h1>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center space-x-4 flex-shrink-0 mt-3">
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          <FaLinkedin
            className="text-white hover:text-yellow-500 transition duration-300"
            size={24}
          />
        </a>
        <a href={github} target="_blank" rel="noopener noreferrer">
          <FaGithub
            className="text-white hover:text-yellow-500 transition duration-300"
            size={24}
          />
        </a>
      </div>
    </div>
  );
};

export default Card;
