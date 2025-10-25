import { GetServerSideProps } from "next";
import Link from "next/link";
import { Research } from "../../types";
import Navbar from "@/components/nav";
import Footer from "@/components/footar";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
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
          <div className="text-center mb-12">
            <h1 className="text-white text-5xl lg:text-6xl font-bold mb-4">
              Research Publications
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Explore cutting-edge research and academic contributions from our
              community
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-9">
            {research.map((paper) => (
              <div
                key={paper.id}
                className={clsx(
                  "bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl",
                  "border border-gray-800",
                  "hover:border-purple-500/50",
                  "hover:shadow-xl hover:shadow-purple-500/10",
                  "transition-all duration-300",
                  "flex flex-col",
                  "group"
                )}
              >
                <Link href={`/research/${paper.slug}`}>
                  <div className="mb-5">
                    <h2 className="text-white text-2xl font-bold mb-2 hover:text-purple-400 transition-colors leading-tight">
                      {paper.title}
                    </h2>
                  </div>
                </Link>

                <div className="text-gray-400 text-sm mb-5 space-y-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Authors
                    </span>
                    <span className="text-gray-300">{paper.authors}</span>
                  </div>

                  {paper.co_authors && paper.co_authors.length > 0 && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Club Co-Authors
                      </span>
                      <span className="text-gray-300">
                        {paper.co_authors
                          .map((ca: any) => ca.full_name || ca.username)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {paper.journal_name && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Journal
                      </span>
                      <span className="text-gray-300">
                        {paper.journal_name}
                      </span>
                    </div>
                  )}

                  {paper.publication_date && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Published
                      </span>
                      <span className="text-gray-300">
                        {new Date(paper.publication_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}

                  {paper.created_by && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted by
                      </span>
                      <span className="text-gray-300">
                        {paper.created_by.full_name ||
                          paper.created_by.username}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="mt-auto flex flex-wrap gap-3">
                  <Link
                    href={`/research/${paper.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </Link>
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Full Paper
                    </a>
                  )}
                  {paper.document && (
                    <a
                      href={paper.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Download
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

          {/* Newsletter Subscription */}
          <div className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <NewsletterSubscribe
                category="RESEARCH"
                title="Subscribe to Research Updates"
                description="Stay informed about cutting-edge research publications from our community. Get notified about new papers, findings, and academic contributions."
              />
            </div>
          </div>
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
