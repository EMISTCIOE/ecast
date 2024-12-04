import Footer from '@/components/footar';
import NavBar from '@/components/nav';
import Image from 'next/image'; 


const projects = [
  {
    id: 1,
    title: "Yathartha",
    description:
      "The ECAST community proudly collaborated on this project to build the official website for YATHARTHA, the largest tech fest in the history of Thapathali Campus.",
    imageUrl: "/assets/yathartha.jpg", 
    pageUrl: "https://yathartha.tcioe.edu.np/",
  },
  {
    id: 2,
    title: "Campus Website",
    description:
      "The members of the ECAST community were actively involved in developing the official website for Thapathali Campus.",
    imageUrl: "/assets/thapathalicampus.jpg",
    pageUrl: "https://www.tcioe.edu.np/",
  },
];

const Project = () => {
  return (
    <>
    <NavBar />
      <div className="App text-center p-8 bg-black min-h-screen">
        <div className="flex flex-col items-center justify-center pt-4">
          <p className="text-center text-white font-bold text-xl">
            ECAST PROJECTS
          </p>
          <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-4 border-orange-600 my-4"></div>
          <div className="flex flex-wrap justify-center ">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-sm mx-10 hover:border-blue-950 transition duration-500 cursor-pointer my-8 border-black animate-glow rounded-3xl overflow-hidden bg-black"
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={500} 
                  height={300} 
                  className="w-full"
                />
                <div className="p-4">
                  <h2 className="text-lg text-white font-bold mb-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-white">{project.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Project;
