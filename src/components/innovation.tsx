import { useRouter } from 'next/router'; 
import styles from "./css/file1.module.css"; 

const Innovation = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/ourevents'); 
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-black text-white pt-10">
        <p className="text-center font-bold text-xl">IT'S PROGRAMS</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>

      <div className={`highlight text-white flex justify-between w-full h-auto pb-12 bg-black flex-col sm:flex-row sm:justify-center`}>
        <div className={styles["semi-container"]}>
          ECAST conducts various programs, including flagship events like <b>"My First Commit," </b> a Software Fellowship Program focusing on emerging technologies and web development. They organize competitions like the <b>"Pride Month Design Competition"</b> to raise awareness and celebrate LGBTQIA+ rights.<br></br> 
          Additionally, ECAST hosts seminars and talks such as <b>"Unleashing the Art of Enquiry"</b> and <b>"Talk Show on Block Chain"</b> to explore research and career prospects in technology fields. The society actively participates in projects like the development of the Thapathali Campus website and engages in initiatives like the Yathartha Tech-Fest, where they handle tasks such as proposal writing, social media management, website development, and event coordination.
          <br></br> ECAST also conducts coding competitions, gaming events like the PUBG Competition, and workshops on topics ranging from ASP.NET to machine learning. Looking ahead, their future plans include organizing workshops, documentation sessions, and projects related to machine learning and blockchain, aiming to continue promoting technological innovation and skill development within the campus community.
          <br />
          <br></br>
          <div className="flex justify-center">
            <div className="button-container2 flex justify-center">
              <br />
              <button
                onClick={handleClick}
                className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-red-500 outline-none transition-all hover:bg-red-600 hover:border-transparent mx-2 relative overflow-hidden"
              >
                See Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Innovation;
