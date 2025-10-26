import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import { useEffect, useState } from "react";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const currentBatchYear = process.env.NEXT_PUBLIC_CURRENT_BATCH_YEAR || "2082";

export default function LeaderboardPage() {
  const [type, setType] = useState<"ambassadors" | "alumni">("ambassadors");
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const path =
      type === "ambassadors"
        ? "leaderboard/ambassadors/"
        : "leaderboard/alumni/";
    // Ambassadors: always filter by current batch
    // Alumni: show all batches competing
    const batchParam =
      type === "ambassadors" ? `?batch_year=${currentBatchYear}` : "";
    fetch(`${base}/api/auth/${path}${batchParam}`)
      .then((r) => r.json())
      .then(setRows)
      .catch(() => setRows([]));
  }, [type]);

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Leaderboard
        </h1>

        {/* Type selector */}
        <div className="mb-6 space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              type === "ambassadors" ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setType("ambassadors")}
          >
            Ambassadors (Current Batch)
          </button>
          <button
            className={`px-4 py-2 rounded ${
              type === "alumni" ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setType("alumni")}
          >
            Alumni (All Batches)
          </button>
        </div>

        <div className="bg-gray-900 p-6 rounded">
          {rows.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No users found</div>
          ) : (
            rows.map((r, idx) => (
              <div key={r.id} className="border-b border-gray-800 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 text-center font-bold">#{idx + 1}</div>
                    {r.photo && (
                      <img
                        src={r.photo}
                        alt={r.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold">
                        {r.full_name || r.username}
                      </div>
                      <div className="text-sm text-gray-400">
                        {type === "ambassadors"
                          ? `${r.blogs} blogs • ${r.tasks_completed} tasks`
                          : `${r.blogs} blogs`}
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="bg-gray-800 h-3 rounded">
                      <div
                        className="bg-green-600 h-3 rounded"
                        style={{
                          width: `${Math.min(
                            100,
                            ((r.points || 0) /
                              Math.max(1, rows[0]?.points || 1)) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right font-semibold">
                    {r.points} pts
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
