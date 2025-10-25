import Link from "next/link";
import { 
  SparklesIcon,
  ArrowRightIcon,
  BeakerIcon,
  CodeBracketIcon 
} from "@heroicons/react/24/outline";

interface LatestContent {
  type: 'project' | 'research';
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
  const isProject = type === 'project';
  
  return (
    <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <SparklesIcon className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold">
            Latest {isProject ? 'Project' : 'Research'}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              {isProject ? (
                <CodeBracketIcon className="w-8 h-8 text-yellow-600" />
              ) : (
                <BeakerIcon className="w-8 h-8 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {data.title}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                Published on {new Date(data.created_at).toLocaleDateString()}
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {data.description}
              </p>
              
              <div className="flex gap-4">
                <Link
                  href={isProject ? `/projects/${data.slug || data.id}` : `/research/${data.slug || data.id}`}
                  className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  View Details
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                
                {isProject && data.github_link && (
                  <a
                    href={data.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    View on GitHub
                  </a>
                )}
                
                {!isProject && data.document && (
                  <a
                    href={data.document.startsWith('http') ? data.document : `${BASE_URL}${data.document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-lg hover:bg-yellow-50 transition-colors"
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
