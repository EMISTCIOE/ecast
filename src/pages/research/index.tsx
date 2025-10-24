import { GetServerSideProps } from "next";
import Link from "next/link";
import { Research } from "../../types";
import Navbar from "@/components/nav";
import Footer from "@/components/footar";
import clsx from "clsx";

interface ResearchListProps {
  research: Research[];
}

const ResearchList: React.FC<ResearchListProps> = ({ research }) => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-black w-full min-h-screen">
        <div className="container max-w-7xl px-4 lg:px-8 py-8">
          <h1 className="text-white text-center text-6xl font-bold my-8">
            Research Publications
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-9">
            {research.map((paper) => (
              <div
                key={paper.id}
                className={clsx(
                  "bg-gray-900 p-6 rounded-lg",
                  "border-4",
                  "border-transparent",
                  "hover:border-[#5f20ff]",
                  "animate-pulse-border-shadow-green",
                  "flex flex-col"
                )}
              >
                <Link href={`/research/${paper.slug}`}>
                  <div>
                    <h2 className="text-white text-2xl font-semibold mb-3 hover:text-[#5f20ff] transition-colors">
                      {paper.title}
                    </h2>
                  </div>
                </Link>

                <div className="text-gray-400 text-sm mb-4 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-300">
                      Authors:
                    </span>{" "}
                    {paper.authors}
                  </p>
                  {paper.co_authors && paper.co_authors.length > 0 && (
                    <p>
                      <span className="font-semibold text-gray-300">
                        Club Co-Authors:
                      </span>{" "}
                      {paper.co_authors
                        .map((ca: any) => ca.full_name || ca.username)
                        .join(", ")}
                    </p>
                  )}
                  {paper.journal_name && (
                    <p>
                      <span className="font-semibold text-gray-300">
                        Journal:
                      </span>{" "}
                      {paper.journal_name}
                    </p>
                  )}
                  {paper.publication_date && (
                    <p>
                      <span className="font-semibold text-gray-300">
                        Published:
                      </span>{" "}
                      {new Date(paper.publication_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}
                  {paper.created_by && (
                    <p>
                      <span className="font-semibold text-gray-300">
                        Submitted by:
                      </span>{" "}
                      {paper.created_by.full_name || paper.created_by.username}
                    </p>
                  )}
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {paper.abstract}
                </p>

                <div className="mt-auto flex gap-3">
                  <Link
                    href={`/research/${paper.slug}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read more...
                  </Link>
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:underline"
                    >
                      View Paper ↗
                    </a>
                  )}
                  {paper.document && (
                    <a
                      href={paper.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      Download 📄
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {research.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">No research publications found.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResearchList;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const host = ctx.req?.headers?.host || "localhost:3000";
  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";
  try {
    const res = await fetch(
      `${protocol}://${host}/api/app/research/list?status=APPROVED`
    );
    const items = await res.json();
    const research: Research[] = Array.isArray(items) ? items : [];

    return {
      props: {
        research,
      },
    };
  } catch (error) {
    console.error("Error fetching research:", error);
    return {
      props: {
        research: [],
      },
    };
  }
};
