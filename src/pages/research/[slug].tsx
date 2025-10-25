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
          <div className="container max-w-5xl px-4 lg:px-8 py-12">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-white text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                {research.title}
              </h1>

              {/* Metadata */}
              <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      All Authors
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      {research.authors}
                    </p>
                  </div>

                  {research.co_authors && research.co_authors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Club Member Co-Authors
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {research.co_authors.map((coAuthor: any) => (
                          <Link
                            key={coAuthor.id}
                            href={`/alumni/${coAuthor.username}`}
                            className="bg-purple-900/40 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800/60 border border-purple-700/30 transition-colors"
                          >
                            {coAuthor.full_name || coAuthor.username}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {research.publication_date && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Publication Date
                      </p>
                      <p className="text-white text-base">
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
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Journal
                      </p>
                      <p className="text-white text-base">
                        {research.journal_name}
                      </p>
                    </div>
                  )}

                  {research.doi && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        DOI
                      </p>
                      <p className="text-blue-400 text-base break-all font-mono">
                        {research.doi}
                      </p>
                    </div>
                  )}
                </div>

                {research.keywords && (
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {research.keywords
                        .split(",")
                        .map((keyword: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-800/60 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700/50"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {research.created_by && (
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Submitted by
                    </p>
                    <p className="text-white text-base">
                      {research.created_by.full_name ||
                        research.created_by.username}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Abstract Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 mb-8">
              <h2 className="text-white text-2xl font-bold mb-5 pb-4 border-b border-gray-800">
                Abstract
              </h2>
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                {research.abstract}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              {research.url && (
                <a
                  href={research.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                >
                  View Full Paper
                </a>
              )}
              {research.document && (
                <a
                  href={research.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  Download Document
                </a>
              )}
            </div>

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <Link
                href="/research"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                <span className="mr-2">←</span>
                Back to Research Publications
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
