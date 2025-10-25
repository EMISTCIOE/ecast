import { useEffect, useState } from "react";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import { TrophyIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { authedFetch } from "@/lib/apiClient";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface AlumniUser {
  id: number;
  username: string;
  full_name: string;
  photo?: string;
  linkedin_url?: string;
  github_url?: string;
  batch_year_bs: number;
  blogs: number;
  points: number;
  is_active: boolean;
}

export default function AlumniPage() {
  const [topThree, setTopThree] = useState<AlumniUser[]>([]);
  const [alumniByBatch, setAlumniByBatch] = useState<
    Record<number, AlumniUser[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlumniData();
  }, []);

  const loadAlumniData = async () => {
    try {
      const response = await fetch(`${base}/api/auth/leaderboard/alumni/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: AlumniUser[] = await response.json();

      // Get top 3
      setTopThree(data.slice(0, 3));

      // Group by batch year
      const byBatch: Record<number, AlumniUser[]> = {};
      data.forEach((alumni) => {
        const batch = alumni.batch_year_bs || 0;
        if (batch > 0) {
          if (!byBatch[batch]) {
            byBatch[batch] = [];
          }
          byBatch[batch].push(alumni);
        }
      });

      setAlumniByBatch(byBatch);
    } catch (error) {
      console.error("Failed to load alumni data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPodiumColor = (index: number) => {
    if (index === 0) return "from-yellow-500 to-yellow-600";
    if (index === 1) return "from-gray-300 to-gray-400";
    if (index === 2) return "from-orange-500 to-orange-600";
    return "from-gray-600 to-gray-700";
  };

  const getPodiumHeight = (index: number) => {
    if (index === 0) return "h-64";
    if (index === 1) return "h-56";
    if (index === 2) return "h-48";
    return "h-40";
  };

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading alumni data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen">
        <div className="container mx-auto px-4 py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Alumni Leaderboard
            </h1>
            <p className="text-gray-400 text-lg">
              Celebrating our outstanding alumni and their contributions
            </p>
          </div>

          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                <TrophyIcon className="w-8 h-8 text-yellow-400" />
                Top 3 Alumni
              </h2>
              <div className="flex items-end justify-center gap-8 max-w-5xl mx-auto">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex-1 max-w-xs">
                    <div
                      className={`bg-gradient-to-b ${getPodiumColor(
                        1
                      )} ${getPodiumHeight(
                        1
                      )} rounded-t-2xl p-6 flex flex-col items-center justify-end shadow-2xl transform transition hover:scale-105`}
                    >
                      <div className="text-6xl mb-3">{getRankEmoji(1)}</div>
                      {topThree[1].photo ? (
                        <img
                          src={
                            topThree[1].photo.startsWith("http")
                              ? topThree[1].photo
                              : `${base}${topThree[1].photo}`
                          }
                          alt={topThree[1].full_name}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 bg-gray-700 flex items-center justify-center">
                          <AcademicCapIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 text-center">
                        {topThree[1].full_name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-2">
                        Batch {topThree[1].batch_year_bs}
                      </p>
                      <div className="bg-white rounded-lg px-4 py-2 mt-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {topThree[1].points}
                        </p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex-1 max-w-xs">
                    <div
                      className={`bg-gradient-to-b ${getPodiumColor(
                        0
                      )} ${getPodiumHeight(
                        0
                      )} rounded-t-2xl p-6 flex flex-col items-center justify-end shadow-2xl transform transition hover:scale-105`}
                    >
                      <div className="text-7xl mb-4 animate-bounce">
                        {getRankEmoji(0)}
                      </div>
                      {topThree[0].photo ? (
                        <img
                          src={
                            topThree[0].photo.startsWith("http")
                              ? topThree[0].photo
                              : `${base}${topThree[0].photo}`
                          }
                          alt={topThree[0].full_name}
                          className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4 bg-gray-700 flex items-center justify-center">
                          <AcademicCapIcon className="w-14 h-14 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 text-center">
                        {topThree[0].full_name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-2">
                        Batch {topThree[0].batch_year_bs}
                      </p>
                      <div className="bg-white rounded-lg px-6 py-3 mt-2">
                        <p className="text-3xl font-bold text-gray-900">
                          {topThree[0].points}
                        </p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex-1 max-w-xs">
                    <div
                      className={`bg-gradient-to-b ${getPodiumColor(
                        2
                      )} ${getPodiumHeight(
                        2
                      )} rounded-t-2xl p-6 flex flex-col items-center justify-end shadow-2xl transform transition hover:scale-105`}
                    >
                      <div className="text-6xl mb-3">{getRankEmoji(2)}</div>
                      {topThree[2].photo ? (
                        <img
                          src={
                            topThree[2].photo.startsWith("http")
                              ? topThree[2].photo
                              : `${base}${topThree[2].photo}`
                          }
                          alt={topThree[2].full_name}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 bg-gray-700 flex items-center justify-center">
                          <AcademicCapIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 text-center">
                        {topThree[2].full_name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-2">
                        Batch {topThree[2].batch_year_bs}
                      </p>
                      <div className="bg-white rounded-lg px-4 py-2 mt-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {topThree[2].points}
                        </p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alumni by Batch Year */}
          <div className="max-w-6xl mx-auto">
            {Object.keys(alumniByBatch)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map((batchYear) => {
                const batch = alumniByBatch[parseInt(batchYear)];
                return (
                  <div key={batchYear} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <AcademicCapIcon className="w-7 h-7 text-blue-400" />
                      Batch Year {batchYear}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batch.map((alumni, _index) => (
                        <Link
                          key={alumni.id}
                          href={`/alumni/${alumni.username}`}
                          className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition shadow-xl cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            {alumni.photo ? (
                              <img
                                src={
                                  alumni.photo.startsWith("http")
                                    ? alumni.photo
                                    : `${base}${alumni.photo}`
                                }
                                alt={alumni.full_name}
                                className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full border-2 border-blue-500 bg-gray-700 flex items-center justify-center">
                                <AcademicCapIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {alumni.full_name}
                              </h3>
                              <p className="text-sm text-gray-400 mb-2">
                                {alumni.blogs} blog
                                {alumni.blogs !== 1 ? "s" : ""}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-yellow-400 font-bold text-xl">
                                  {alumni.points}
                                </span>
                                <span className="text-xs text-gray-400">
                                  points
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {alumni.linkedin_url && (
                                  <a
                                    href={alumni.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                  </a>
                                )}
                                {alumni.github_url && (
                                  <a
                                    href={alumni.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-300 transition"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
