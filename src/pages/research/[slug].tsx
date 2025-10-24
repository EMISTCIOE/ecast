import { GetServerSideProps } from "next";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import React from "react";
import { Research } from "../../types";
import Link from "next/link";

interface ResearchProps {
  research: Research;
}

const ResearchDetail: React.FC<ResearchProps> = ({ research }) => {
  return (
    <>
      <NavBar />
      <div className="bg-black w-full min-h-screen">
        <div className="flex justify-center bg-black w-full">
          <div className="container max-w-4xl px-4 lg:px-8 py-12">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6">
                {research.title}
              </h1>

              {/* Metadata */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">All Authors</p>
                    <p className="text-white text-lg">{research.authors}</p>
                  </div>

                  {research.co_authors && research.co_authors.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">
                        Club Member Co-Authors
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {research.co_authors.map((coAuthor: any) => (
                          <Link
                            key={coAuthor.id}
                            href={`/alumni/${coAuthor.username}`}
                            className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm hover:bg-purple-800/40 transition-colors"
                          >
                            {coAuthor.full_name || coAuthor.username}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {research.publication_date && (
                    <div>
                      <p className="text-gray-400 text-sm">Publication Date</p>
                      <p className="text-white text-lg">
                        {new Date(research.publication_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {research.journal_name && (
                    <div>
                      <p className="text-gray-400 text-sm">Journal</p>
                      <p className="text-white text-lg">
                        {research.journal_name}
                      </p>
                    </div>
                  )}

                  {research.doi && (
                    <div>
                      <p className="text-gray-400 text-sm">DOI</p>
                      <p className="text-blue-400 text-lg break-all">
                        {research.doi}
                      </p>
                    </div>
                  )}
                </div>

                {research.keywords && (
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-gray-400 text-sm mb-2">Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {research.keywords
                        .split(",")
                        .map((keyword: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {research.created_by && (
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">Submitted by</p>
                    <p className="text-white">
                      {research.created_by.full_name ||
                        research.created_by.username}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Abstract Section */}
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 mb-6">
              <h2 className="text-white text-2xl font-semibold mb-4">
                Abstract
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {research.abstract}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {research.url && (
                <a
                  href={research.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  View Full Paper ↗
                </a>
              )}
              {research.document && (
                <a
                  href={research.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all"
                >
                  Download Document 📄
                </a>
              )}
            </div>

            {/* Back Link */}
            <div className="mt-12">
              <Link
                href="/research"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Research Publications
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const { slug } = params as { slug: string };
  const host = req?.headers?.host || "localhost:3000";
  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";
  try {
    const res = await fetch(
      `${protocol}://${host}/api/app/research/detail?slug=${encodeURIComponent(
        slug
      )}`
    );
    if (!res.ok) throw new Error("not found");
    const research = await res.json();
    return { props: { research } };
  } catch (_e) {
    return { notFound: true };
  }
};

export default ResearchDetail;
