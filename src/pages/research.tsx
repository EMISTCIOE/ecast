import Footer from '@/components/footar';
import NavBar from '@/components/nav';
import styles from "../components/css/file1.module.css"; 

const Research = () => {
  

  const researchPDF = '/assets/research/ProposalDeepGenerativeModelingforAutomatedImageManipulationbyInterpretingText-GuidedPromptswithNaturalLanguageInstructions.pdf';

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center bg-black text-white pt-10">
        <p className="text-center font-bold text-xl">RESEARCH</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>

      <div className={`${styles.highlight} text-white flex justify-between w-full h-auto pb-12 bg-black flex-col sm:flex-row sm:justify-center`}>
        <div className={`${styles["semi-container"]} mt-1`}>
          <p className="text-center font-bold text-xl">
            Deep Generative Modeling for Automated Image Manipulation by Interpreting Text-Guided Prompts with Natural Language Instructions
          </p>
          <br />
          This research was led by Nishan Khanal. The R&D Unit initiated the work of research in our community. The first notable work of this unit includes a collaboration with Racheal Lau regarding a talk on research.
          <br /><br />
          Under the supervision of Asst. Professor Er. Dinesh Banyia Khastri, R&D Unit applied for the research grant proposed by NCE College. For this research, the R&D Unit of ECAST collaborated with the Central Department of Physics, TU for resources. This research aims to develop a new algorithm in the field of image processing using a diffusion model. The research on completion will develop an algorithm for undoing and redoing edited images.
          <br /><br />
          <br></br>
          <br></br>
          <div className="flex justify-center">

            <button
              className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-black outline-none transition-all hover:bg-red-600 hover:border-transparent mx-2 relative overflow-hidden"
              onClick={() => {
                const link = document.createElement('a');
                link.href = researchPDF; 
                link.download = 'Research_Proposal.pdf'; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-red-600 mix-blend-overlay animate-neon"></span>
              Download Article
            </button>

            <button
              className="btn text-white no-underline p-2 font-semibold cursor-pointer rounded border-2 border-black outline-none transition-all hover:bg-red-600 hover:border-transparent mx-2 relative overflow-hidden"
              onClick={() => {
                window.location.href = researchPDF; 
              }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-red-600 mix-blend-overlay animate-neon"></span>
              Demonstration
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Research;
