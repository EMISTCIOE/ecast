import { UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface UserCountsProps {
  ambassadors: number;
  alumni: number;
}

export default function UserCountsSection({
  ambassadors,
  alumni,
}: UserCountsProps) {
  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-xl font-bold text-white mb-4">Our Community</h2>

        <div className="grid md:grid-cols-2 gap-3">
          {/* Ambassadors Count */}
          <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 hover:border-blue-500 hover:bg-gray-900 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/50 rounded">
                <UserGroupIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {ambassadors}
                </div>
                <div className="text-sm text-gray-400">Active Ambassadors</div>
              </div>
            </div>
          </div>

          {/* Alumni Count */}
          <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 hover:border-blue-500 hover:bg-gray-900 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/50 rounded">
                <AcademicCapIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{alumni}</div>
                <div className="text-sm text-gray-400">Alumni Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
