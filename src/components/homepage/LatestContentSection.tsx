import Link from "next/link";
import {
  SparklesIcon,
  BeakerIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface LatestContent {
  type: "project" | "research";
  data: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    slug?: string;
    github_link?: string;
    document?: string;
  };
}

interface LatestContentProps {
  content: LatestContent | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function LatestContentSection({ content }: LatestContentProps) {
  if (!content) {
    return null;
  }

  const { type, data } = content;
  const isProject = type === "project";

  return (
    <section className="py-8 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">
            Latest {isProject ? "Project" : "Research"}
          </h2>
        </div>

        <div className="border border-gray-800 rounded-lg p-4 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-900/50 rounded">
              {isProject ? (
                <CodeBracketIcon className="w-5 h-5 text-blue-400" />
              ) : (
                <BeakerIcon className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">{data.title}</h3>

              <p className="text-xs text-gray-400 mb-2">
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {data.description}
              </p>

              <div className="flex gap-2">
                <Link
                  href={
                    isProject
                      ? `/projects/${data.slug || data.id}`
                      : `/research/${data.slug || data.id}`
                  }
                  className="text-xs px-3 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>

                {isProject && data.github_link && (
                  <a
                    href={data.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 border border-blue-600 text-blue-400 font-medium rounded hover:bg-blue-900/50 transition-colors"
                  >
                    GitHub
                  </a>
                )}

                {!isProject && data.document && (
                  <a
                    href={
                      data.document.startsWith("http")
                        ? data.document
                        : `${BASE_URL}${data.document}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 border border-blue-600 text-blue-400 font-medium rounded hover:bg-blue-900/50 transition-colors"
                  >
                    Read Paper
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
