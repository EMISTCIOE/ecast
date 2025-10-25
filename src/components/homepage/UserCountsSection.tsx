import { 
  UserGroupIcon,
  AcademicCapIcon 
} from "@heroicons/react/24/outline";

interface UserCountsProps {
  ambassadors: number;
  alumni: number;
}

export default function UserCountsSection({ ambassadors, alumni }: UserCountsProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Community
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Ambassadors Count */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/20 transition-colors">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-500 rounded-full">
                <UserGroupIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="text-5xl font-bold mb-2 text-yellow-400">
              {ambassadors}
            </div>
            <div className="text-xl font-semibold text-gray-300">
              Active Ambassadors
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Current batch ambassadors representing ECAST
            </p>
          </div>

          {/* Alumni Count */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/20 transition-colors">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-500 rounded-full">
                <AcademicCapIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="text-5xl font-bold mb-2 text-yellow-400">
              {alumni}
            </div>
            <div className="text-xl font-semibold text-gray-300">
              Alumni Members
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Graduated members of the ECAST family
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
