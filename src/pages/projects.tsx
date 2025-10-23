import Footer from "@/components/footar";
import NavBar from "@/components/nav";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useProjects } from "@/lib/hooks/projects";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

const Project = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { list } = useProjects();

  useEffect(() => {
    // Fetch approved projects from backend
    list({ status: "APPROVED" })
      .then((data: any[]) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [list]);

  return (
    <>
      <NavBar />
      <div className="App text-center p-8 bg-black min-h-screen">
        <div className="flex flex-col items-center justify-center pt-4">
          <p className="text-center text-white font-bold text-xl">
            ECAST PROJECTS
          </p>
          <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-4 border-orange-600 my-4"></div>

          {loading ? (
            <div className="text-white text-lg mt-8">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-white text-lg mt-8">
              No projects available yet.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center ">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.live_link || project.repo_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-sm mx-10 hover:border-blue-950 transition duration-500 cursor-pointer my-8 border-black animate-glow rounded-3xl overflow-hidden bg-black"
                >
                  <Image
                    src={
                      project.image?.startsWith("http")
                        ? project.image
                        : `${base}${project.image}`
                    }
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
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Project;
