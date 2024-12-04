import { useRouter } from 'next/router'; 
import styles from "../components/css/file1.module.css"; 
import NavBar from '@/components/nav';
import Footer from '@/components/footar';
import Innovation from '@/components/innovation';

const WhatIsEcast = () => {
  const router = useRouter(); 
  
  const handleClick = () => {
    router.push('/committee'); 
  };

  return (
    <>
    <NavBar />
      <div className="flex flex-col items-center justify-center bg-black text-white pt-10">
        <p className="text-center font-bold text-xl">WHAT IS ECAST?</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>

      <div className={`${styles.highlight} text-white flex justify-between w-full h-auto pb-12 bg-black flex-col sm:flex-row sm:justify-center`}>
        <div className={`${styles["semi-container"]} mt-6`}>
          <p className={styles.head}>
            ECAST (Electronics and Computer Community Amidst Students) &nbsp;
          </p>
          is a vibrant and dynamic student club at Thapathali Engineering Campus, Kathmandu. ECAST was established in 2016 A.D., and is a non-political student-led community.
          <br />
          <br />
          As a non-political student union, ECAST serves as the representative body for Electronics and Computer engineering students, dedicated to their holistic development and success.
          <br />
          <br />
          Our mission is to guide students towards achieving excellence in their academic and professional lives by organizing a variety of activities that enhance their skills and knowledge. Through workshops, seminars, competitions, and collaborative projects, ECAST provides a platform for students to explore and innovate in the fields of electronics and computer engineering.
          <br />
          <br />
          At ECAST, we believe in fostering a community where students can learn, grow, and excel together. Our initiatives are designed to bridge the gap between theoretical knowledge and practical application, ensuring that our members are well-prepared for the challenges of the modern engineering landscape.
          <br />
          <br />
          Join ECAST and be a part of Thapathali &apos;s premier student club dedicated to elevating the skillsets of future engineers.
          <br />
          <div className="mt-6"></div>
          <div className="flex justify-center">
            <div className="button-container2 flex justify-center">
              <br />
              <button onClick={handleClick} className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-red-500 outline-none transition-all hover:bg-red-600 hover:border-transparent mx-2 relative overflow-hidden">
                See Our Team
              </button>
            </div>
          </div>
        </div>
      </div>
      <Innovation />
    <Footer />
    </>
  );
};

export default WhatIsEcast;
