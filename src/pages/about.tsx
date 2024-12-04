import Footer from '@/components/footar';
import NavBar from '@/components/nav';
import { useRouter } from 'next/router'; 

const About = () => {
  const router = useRouter(); 

  const whatisEcastClick = () => {
    router.push("/whatisecast");
  };

  const researchClick = () => {
    router.push("/research");
  };

  const workshopClick = () => {
    router.push("/workshop");
  };

  return (
    <>
    <NavBar/>
      <div className="flex flex-col items-center justify-center bg-black text-white pt-20">
        <p className="text-center font-bold text-xl">WHAT ECAST IS ALL ABOUT?</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>

      <section className="highlight text-white flex justify-between w-full h-auto pb-40 bg-black flex-col sm:flex-row sm:justify-center">
        <div className="card text-white mr-8 ml-8 mt-10 pt-10 relative flex items-center justify-center p-8 overflow-hidden flex-basis-30 sm:w-96 shadow-outline-red rounded-2xl w-auto shadow-custom">
          <div className="content flex flex-col items-start gap-5">
            <p className="heading font-bold text-3xl">What is ECAST?</p>
            <p className="para leading-normal">
              ECAST (Electronics and Computer Community Amidst Students) is a vibrant and dynamic student club at ....
            </p>
            <button
              className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-gray-300 outline-none transition-all hover:bg-crimson hover:border-transparent"
              onClick={whatisEcastClick}
            >
              Read more
            </button>
          </div>
          <div className="card-before absolute left-0 top-0 w-full h-px bg-gradient-to-r from-blue-700 to-crimson-700 z-10" />
        </div>
        <div className="card text-white mr-8 ml-8 mt-10 pt-10 relative flex items-center justify-center p-8 overflow-hidden flex-basis-30 sm:w-96 shadow-outline-red rounded-2xl w-auto shadow-custom">
          <div className="content flex flex-col items-start gap-5">
            <p className="heading font-bold text-3xl">Workshops</p>
            <p className="para leading-normal">
              ECAST has successfully organized several impactful workshops and events over the past year, significantly contributing ...
            </p>
            <button
              className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-gray-300 outline-none transition-all hover:bg-crimson hover:border-transparent"
              onClick={workshopClick}
            >
              Read more
            </button>
          </div>
          <div className="card-before absolute left-0 top-0 w-full h-px bg-gradient-to-r from-blue-700 to-crimson-700 z-10" />
        </div>

        
        <div className="card text-white mr-8 ml-8 mt-10 pt-10 relative flex items-center justify-center p-8 overflow-hidden flex-basis-30 sm:w-96 box-shadow-card rounded-2xl w-auto shadow-custom">
          <div className="content flex flex-col items-start gap-5">
            <p className="heading font-bold text-3xl">Research</p>
            <p className="para leading-normal">
              Undertaking research initiatives that delve into cutting-edge topics such as artificial intelligence, cybersecurity, machine learning, and more ...
            </p>
            <button
              className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-gray-300 outline-none transition-all hover:bg-crimson hover:border-transparent"
              onClick={researchClick}
            >
              Read more
            </button>
          </div>
          <div className="card-before absolute left-0 top-0 w-full h-px bg-gradient-to-r from-blue-700 to-crimson-700 z-10"></div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
