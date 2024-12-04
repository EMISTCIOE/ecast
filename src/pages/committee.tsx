import { useEffect, useState } from "react";
import Card from "../components/card"
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

  useEffect(() => {
    setTeamMemberList([
        {
          name: "Dinanath Padhya",
          position: "President",
          imgSrc: "https://avatars.githubusercontent.com/u/85153156?v=4",
          linkedin: "https://linkedin.com/in/whoisdinanath/",
          github: "https://github.com/whoisdinanath",
        },
        {
          name: "Suprem Khatri",
          position: "Vice President",
          imgSrc: "https://avatars.githubusercontent.com/u/128308240?v=4",
          linkedin: "https://www.linkedin.com/in/suprem-khatri-96ab3125a/",
          github: "https://github.com/supremkhatri",
        },
        {
          name: "Pratik Pokharel",
          position: "General Secretary",
          imgSrc: "https://avatars.githubusercontent.com/u/62210661?v=4",
          linkedin: "https://www.linkedin.com/in/pratik-pokharel-b684b91a0/",
          github: "https://github.com/pratik-writer",
        },
        {
          name: "Dikshya Khatri",
          position: "Vice Secretary / Treasurer",
          imgSrc: "https://avatars.githubusercontent.com/u/155458211?v=4",
          linkedin: "https://www.linkedin.com/in/dikshya-khatri-823826279/",
          github: "https://github.com/Dikshyakhatri333",
        },
        {
          name: "Kaushik Rayamajhi",
          position: "Research and Development Team",
          imgSrc: "https://avatars.githubusercontent.com/u/135457672?v=4",
          linkedin: "https://www.linkedin.com/in/kaushik-rayamajhi-102269263/",
          github: "https://github.com/Kaushik-Rayamajhi",
        },
        {
          name: "Sandesh Dhital",
          position: "Research and Development Team",
          imgSrc: "https://avatars.githubusercontent.com/u/121079888?v=4",
          linkedin: "https://www.linkedin.com/in/sandesh-dhital/",
          github: "https://github.com/sandesh034",
        },
        {
          name: "Abhishek Panthee",
          position: "Research and Development Team",
          imgSrc: "https://avatars.githubusercontent.com/u/80570587?v=4",
          linkedin: "https://www.linkedin.com/in/abhishekpanthee/",
          github: "https://github.com/abhishekpanthee",
        },
        {
          name: "Dharmendra Singh Chaudhary",
          position: "Research and Development Team",
          imgSrc: "https://shotcan.com/images/2024/07/02/Rnd199845903d587784b.jpg",
          linkedin: "https://www.linkedin.com/in/dharmendra-singh-chaudhary/",
          github: "https://github.com/Dharmendra016",
        },
        {
          name: "Sanjay Shrestha",
          position: "Graphics Designer",
          imgSrc: "https://shotcan.com/images/2024/07/02/grds5f990ad29e374355.jpg",
          linkedin: "https://www.linkedin.com/in/sanjay-shrestha-58b3b7275/",
          github: "#",
        },
        {
          name: "Ninamhang Kulung",
          position: "Technical Team",
          imgSrc: "https://avatars.githubusercontent.com/u/118673128?v=4",
          linkedin: "https://www.linkedin.com/in/ninamhang-kulung-5a5805279/",
          github: "https://github.com/hang-kulung",
        },
        {
          name: "Jesis Upadhayaya",
          position: "Technical Team",
          imgSrc: "https://avatars.githubusercontent.com/u/102139711?v=4",
          linkedin: "https://www.linkedin.com/in/jesis-upadhayaya-bba008234/",
          github: "https://github.com/JesisCoder",
        },
        {
          name: "Ujjwal Dahal",
          position: "Technical Team",
          imgSrc: "https://avatars.githubusercontent.com/u/122596469?v=4",
          linkedin: "https://www.linkedin.com/in/brightnessujjwal/",
          github: "https://github.com/ujjwal-dahal",
        },
        {
          name: "Prastut Nepal",
          position: "Technical Team",
          imgSrc: "https://avatars.githubusercontent.com/u/76209855?v=4",
          linkedin: "https://www.linkedin.com/in/prastut-nepal-24325924a/",
          github: "https://github.com/nepalprastut",
        },
        {
          name: "Atul Tiwari",
          position: "Technical Team",
          imgSrc: "https://avatars.githubusercontent.com/u/168094301?v=4",
          linkedin: "https://www.linkedin.com/in/atul-tiwari-a94159241/",
          github: "https://github.com/atultiwari000",
        },
        {
          name: "Plan Ghimire",
          position: "Technical Team",
          imgSrc: "https://avatars.githubusercontent.com/u/164618194?v=4",
          linkedin: "https://www.linkedin.com/in/plan-ghimire/",
          github: "https://github.com/GhimirePlan",
        },
        {
          name: "Om Prakash Sharma",
          position: "Consultant",
          imgSrc: "https://avatars.githubusercontent.com/u/66164291?v=4",
          linkedin: "https://www.linkedin.com/in/ompiepy/",
          github: "https://github.com/ompiepy",
        },
        {
          name: "Prashant Raj Bista",
          position: "Consultant",
          imgSrc: "https://avatars.githubusercontent.com/u/85779064?v=4",
          linkedin: "https://www.linkedin.com/in/prashantrb/",
          github: "https://github.com/Strange18",
        },
        {
          name: "Shristi Mallik",
          position: "Communication, Events and HR",
          imgSrc: "https://shotcan.com/images/2024/07/02/commhr5468ad6fdbd96eff.th.jpg",
          linkedin: "https://www.linkedin.com/in/shristimallik/",
          github: "https://github.com/shmallik111",
        },
        {
          name: "Prenisha Upreti",
          position: "Communications, Events and HR",
          imgSrc: "https://shotcan.com/images/2024/07/02/commhr12702a9c0781ff015.jpg",
          linkedin: "https://www.linkedin.com/in/prenisha-upreti-050553264/",
          github: "https://github.com/prenisha-upreti",
        },
        {
          name: "Shaswat Sharma",
          position: "Editor in Chief",
          imgSrc: "https://shotcan.com/images/2024/07/02/edt1ed2af06f43f4db47.jpg",
          linkedin: "https://www.linkedin.com/in/shaswat-sharma-0a6b76313/",
          github: "https://github.com/shaswat-13",
        },
        {
          name: "Bipul Ratna Shakya",
          position: "Social Media Handler",
          imgSrc: "https://shotcan.com/images/2024/07/02/scmd7f68efb3434d07e7.jpg",
          linkedin: "https://www.linkedin.com/in/bipul-ratna-shakya-baa978318/",
          github: "#",
        },
      ]);
    }, []);

return (
    <>
    <NavBar />
    <section className="bg-black from-theme-lqa flex w-full text-center flex-col p-4">
      <h1 className="text-yellow-500 text-5xl my-8">Our Committee</h1>
      <div className="py-8 grid place-items-center gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {teamMemberList.map((member) => (
          <Card
            key={member.name}
            imgSrc={member.imgSrc || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"}
            name={member.name}
            pos={member.position}
            linkedin={member.linkedin}
            github={member.github || "#"}  
          />
        ))}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Committee;