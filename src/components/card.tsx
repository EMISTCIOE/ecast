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
    <div className="p-8 w-80 h-[420px] bg-black hover:bg-black/90 border-2 border-[#3b340d] hover:border-yellow-400 rounded-xl flex flex-col items-center justify-between transition duration-500">
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

      {/* Name with yellow color */}
      <h1 className="text-3xl my-4 text-yellow-500 text-center line-clamp-2">
        {name}
      </h1>
      <h1 className="text-xl my-4 text-white text-center line-clamp-2">
        {pos}
      </h1>

      {/* Social Media Links */}
      <div className="flex justify-center space-x-4 flex-shrink-0">
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
