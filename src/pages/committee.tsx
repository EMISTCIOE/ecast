import { useEffect, useState } from "react";
import Card from "../components/card";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

interface Member {
  name: string;
  position: string;
  imgSrc: string;
  linkedin: string;
  github: string;
}

const Committee = () => {
  const [teamMemberList, setTeamMemberList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${base}/api/committee/members/`);

        if (!response.ok) {
          throw new Error("Failed to fetch committee members");
        }

        const data = await response.json();

        // Transform API data to match Member interface
        const members = data.map((member: any) => ({
          name: member.full_name || member.username,
          position: member.committee_position || "Member",
          imgSrc: member.memberPhoto
            ? member.memberPhoto.startsWith("http")
              ? member.memberPhoto
              : `${base}${member.memberPhoto}`
            : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
          linkedin: member.linkedin_url || "#",
          github: member.github_url || "#",
        }));

        setTeamMemberList(members);
      } catch (error) {
        console.error("Error fetching committee members:", error);
        // Fallback to empty array on error
        setTeamMemberList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitteeMembers();
  }, []);

  return (
    <>
      <NavBar />
      <section className="bg-black from-theme-lqa flex w-full text-center flex-col p-4">
        <h1 className="text-yellow-500 text-5xl my-8">Our Committee</h1>
        {loading ? (
          <div className="py-8 text-center">
            <div className="text-white text-xl">
              Loading committee members...
            </div>
          </div>
        ) : teamMemberList.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-gray-400 text-xl">
              No committee members found.
            </div>
          </div>
        ) : (
          <div className="py-8 grid place-items-center gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {teamMemberList.map((member) => (
              <Card
                key={member.name}
                imgSrc={member.imgSrc}
                name={member.name}
                pos={member.position}
                linkedin={member.linkedin}
                github={member.github}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Committee;
