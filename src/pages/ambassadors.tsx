import { useEffect, useState } from "react";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import Link from "next/link";
import {
  TrophyIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface AmbassadorUser {
  id: number;
  username: string;
  full_name: string;
  photo?: string;
  linkedin_url?: string;
  github_url?: string;
  batch_year_bs: number;
  blogs: number;
  tasks_completed: number;
  points: number;
  is_active: boolean;
}

export default function AmbassadorsPage() {
  const [currentBatchAmbassadors, setCurrentBatchAmbassadors] = useState<
    AmbassadorUser[]
  >([]);
  const [pastAmbassadors, setPastAmbassadors] = useState<AmbassadorUser[]>([]);
  const [showPastAmbassadors, setShowPastAmbassadors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentBatchYear, setCurrentBatchYear] = useState(2078);

  useEffect(() => {
    loadAmbassadorsData();
  }, []);

  const loadAmbassadorsData = async () => {
    try {
      const response = await fetch(
        `${base}/api/auth/leaderboard/ambassadors/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: AmbassadorUser[] = await response.json();

      // Find the latest batch year
      const batchYears = data
        .map((a) => a.batch_year_bs)
        .filter((year) => year);
      const latestBatch =
        batchYears.length > 0 ? Math.max(...batchYears) : 2078;
      setCurrentBatchYear(latestBatch);

      // Separate current batch and past ambassadors
      const current = data
        .filter((a) => a.batch_year_bs === latestBatch && a.is_active)
        .sort((a, b) => b.points - a.points);
      const past = data.filter(
        (a) => a.batch_year_bs !== latestBatch || !a.is_active
      );

      setCurrentBatchAmbassadors(current);
      setPastAmbassadors(past);
    } catch (error) {
      console.error("Failed to load ambassadors data:", error);
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
    return `#${index + 1}`;
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ambassadors data...</p>
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
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ambassadors Leaderboard
            </h1>
            <p className="text-gray-400 text-lg">
              Celebrating our current ambassadors - Batch {currentBatchYear}
            </p>
          </div>

          {/* Top 3 Podium for Current Batch */}
          {currentBatchAmbassadors.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                <TrophyIcon className="w-8 h-8 text-yellow-400" />
                Top 3 Ambassadors - Batch {currentBatchYear}
              </h2>
              <div className="flex items-end justify-center gap-8 max-w-5xl mx-auto">
                {/* 2nd Place */}
                {currentBatchAmbassadors[1] && (
                  <div className="flex-1 max-w-xs">
                    <div
                      className={`bg-gradient-to-b ${getPodiumColor(
                        1
                      )} ${getPodiumHeight(
                        1
                      )} rounded-t-2xl p-6 flex flex-col items-center justify-end shadow-2xl transform transition hover:scale-105`}
                    >
                      <div className="text-6xl mb-3">{getRankEmoji(1)}</div>
                      {currentBatchAmbassadors[1].photo ? (
                        <img
                          src={
                            currentBatchAmbassadors[1].photo.startsWith("http")
                              ? currentBatchAmbassadors[1].photo
                              : `${base}${currentBatchAmbassadors[1].photo}`
                          }
                          alt={currentBatchAmbassadors[1].full_name}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 bg-gray-700 flex items-center justify-center">
                          <UserGroupIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 text-center">
                        {currentBatchAmbassadors[1].full_name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-1">
                        {currentBatchAmbassadors[1].blogs} blogs,{" "}
                        {currentBatchAmbassadors[1].tasks_completed} tasks
                      </p>
                      <div className="bg-white rounded-lg px-4 py-2 mt-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {currentBatchAmbassadors[1].points}
                        </p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {currentBatchAmbassadors[0] && (
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
                      {currentBatchAmbassadors[0].photo ? (
                        <img
                          src={
                            currentBatchAmbassadors[0].photo.startsWith("http")
                              ? currentBatchAmbassadors[0].photo
                              : `${base}${currentBatchAmbassadors[0].photo}`
                          }
                          alt={currentBatchAmbassadors[0].full_name}
                          className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4 bg-gray-700 flex items-center justify-center">
                          <UserGroupIcon className="w-14 h-14 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 text-center">
                        {currentBatchAmbassadors[0].full_name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-1">
                        {currentBatchAmbassadors[0].blogs} blogs,{" "}
                        {currentBatchAmbassadors[0].tasks_completed} tasks
                      </p>
                      <div className="bg-white rounded-lg px-6 py-3 mt-2">
                        <p className="text-3xl font-bold text-gray-900">
                          {currentBatchAmbassadors[0].points}
                        </p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {currentBatchAmbassadors[2] && (
                  <div className="flex-1 max-w-xs">
                    <div
                      className={`bg-gradient-to-b ${getPodiumColor(
                        2
                      )} ${getPodiumHeight(
                        2
                      )} rounded-t-2xl p-6 flex flex-col items-center justify-end shadow-2xl transform transition hover:scale-105`}
                    >
                      <div className="text-6xl mb-3">{getRankEmoji(2)}</div>
                      {currentBatchAmbassadors[2].photo ? (
                        <img
                          src={
                            currentBatchAmbassadors[2].photo.startsWith("http")
                              ? currentBatchAmbassadors[2].photo
                              : `${base}${currentBatchAmbassadors[2].photo}`
                          }
                          alt={currentBatchAmbassadors[2].full_name}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-3 bg-gray-700 flex items-center justify-center">
                          <UserGroupIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 text-center">
                        {currentBatchAmbassadors[2].full_name}
                      </h3>
                      <p className="text-sm text-gray-800 mb-1">
                        {currentBatchAmbassadors[2].blogs} blogs,{" "}
                        {currentBatchAmbassadors[2].tasks_completed} tasks
                      </p>
                      <div className="bg-white rounded-lg px-4 py-2 mt-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {currentBatchAmbassadors[2].points}
                        </p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Current Batch Ambassadors */}
          {currentBatchAmbassadors.length > 3 && (
            <div className="mb-12 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UserGroupIcon className="w-7 h-7 text-green-400" />
                All Ambassadors - Batch {currentBatchYear}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBatchAmbassadors.slice(3).map((ambassador, index) => (
                  <Link
                    key={ambassador.id}
                    href={`/ambassadors/${ambassador.id}`}
                    className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 hover:border-green-500 transition shadow-xl cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        {ambassador.photo ? (
                          <img
                            src={
                              ambassador.photo.startsWith("http")
                                ? ambassador.photo
                                : `${base}${ambassador.photo}`
                            }
                            alt={ambassador.full_name}
                            className="w-16 h-16 rounded-full border-2 border-green-500 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full border-2 border-green-500 bg-gray-700 flex items-center justify-center">
                            <UserGroupIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 4}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {ambassador.full_name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {ambassador.blogs} blog
                          {ambassador.blogs !== 1 ? "s" : ""},{" "}
                          {ambassador.tasks_completed} task
                          {ambassador.tasks_completed !== 1 ? "s" : ""}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-400 font-bold text-xl">
                            {ambassador.points}
                          </span>
                          <span className="text-xs text-gray-400">points</span>
                        </div>
                        <div className="flex gap-2">
                          {ambassador.linkedin_url && (
                            <a
                              href={ambassador.linkedin_url}
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
                          {ambassador.github_url && (
                            <a
                              href={ambassador.github_url}
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
          )}

          {/* Past Ambassadors Section */}
          {pastAmbassadors.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setShowPastAmbassadors(!showPastAmbassadors)}
                className="w-full bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition shadow-xl flex items-center justify-between mb-6"
              >
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <UserGroupIcon className="w-7 h-7 text-purple-400" />
                  See Past Ambassadors ({pastAmbassadors.length})
                </h2>
                {showPastAmbassadors ? (
                  <ChevronUpIcon className="w-6 h-6 text-purple-400" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-purple-400" />
                )}
              </button>

              {showPastAmbassadors && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastAmbassadors.map((ambassador) => (
                    <div
                      key={ambassador.id}
                      className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        {ambassador.photo ? (
                          <img
                            src={
                              ambassador.photo.startsWith("http")
                                ? ambassador.photo
                                : `${base}${ambassador.photo}`
                            }
                            alt={ambassador.full_name}
                            className="w-16 h-16 rounded-full border-2 border-purple-500 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full border-2 border-purple-500 bg-gray-700 flex items-center justify-center">
                            <UserGroupIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {ambassador.full_name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            Batch {ambassador.batch_year_bs}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            {ambassador.blogs} blog
                            {ambassador.blogs !== 1 ? "s" : ""},{" "}
                            {ambassador.tasks_completed} task
                            {ambassador.tasks_completed !== 1 ? "s" : ""}
                          </p>
                          <div className="flex gap-2">
                            {ambassador.linkedin_url && (
                              <a
                                href={ambassador.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition"
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
                            {ambassador.github_url && (
                              <a
                                href={ambassador.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-300 transition"
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
