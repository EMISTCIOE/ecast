import Footer from '@/components/footar';
import NavBar from '@/components/nav';
import Image from 'next/image';

const Workshop = () => {
  return (
    <>
    <NavBar />
    <div className="bg-black text-white">
      <div className="flex flex-col items-center justify-center bg-black text-white pt-10">
        <p className="text-center font-bold text-xl">WORKSHOP</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>

      <div className="flex flex-col bg-black mx-10 sm:mx-20 md:mx-40 px-4 py-8">
        <p>
          ECAST has successfully organized several impactful workshops and events over the past year, significantly contributing to the education and skill development of students in the electronics and computer engineering fields.
        </p>
        <p className="mt-4">
          On August 26, 2022, we held a comprehensive workshop on Web App Development with Python Django. This was followed by the Cloud Computing with Microsoft Azure and Deploying Web Apps workshop on July 28, 2022, which provided valuable insights into cloud technologies. Additionally, the Linux Workshop conducted on Jestha 26 offered students practical knowledge on using and managing Linux systems.
        </p>
        <p className="mt-4">
          From July 17 to 22, 2022, ECAST also hosted a Competitive Programming event, fostering problem-solving skills and coding proficiency among participants. These initiatives underscore our commitment to enhancing the academic and professional capabilities of our members.
        </p>
        <p className="mt-4">
          Through these activities, ECAST continues to play a pivotal role in advancing the technical expertise of students at Thapathali Engineering Campus.
        </p>

        <div className="image-container mt-8 flex flex-col md:flex-row items-center justify-center">
          <div className="semi-image1 flex flex-col items-center">
            <Image
              className="images m-4 rounded-lg"
              src="/assets/ecast3.webp"
              alt="Workshop Image 1"
              width={400}
              height={300}
            />
            <Image
              className="images m-4 rounded-lg"
              src="/assets/ecast6.webp"
              alt="Workshop Image 2"
              width={400}
              height={300}
            />
          </div>
          <div className="semi-image1 flex flex-col items-center">
            <Image
              className="images m-4 rounded-lg"
              src="/assets/ecast7.webp"
              alt="Workshop Image 3"
              width={400}
              height={300}
            />
            <Image
              className="images m-4 rounded-lg"
              src="/assets/ecast8.webp"
              alt="Workshop Image 4"
              width={400}
              height={300}
            />
            <Image
              className="images m-4 rounded-lg"
              src="https://shotcan.com/images/2024/07/06/449363624_1023379369466682_3008407874607543682_n712a6d91a613817d.jpg"  // Replace with your new image path
              alt="Additional Image"
              width={400}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Workshop;
