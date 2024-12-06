import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Custom404 from "../404";
import Image from "next/image";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

const Certificate: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isValidId, setIsValidId] = useState<boolean | null>(null);

  useEffect(() => {
    if (id) {
      const checkCertificateId = async (certificateId: string) => {
        try {
          const res = await fetch(`/certificates/${certificateId}`);
          if (res.ok) {
            setIsValidId(true);
          } else {
            setIsValidId(false);
          }
        } catch (error) {
          console.error("Error checking certificate ID", error);
          setIsValidId(false);
        }
      };

      const certificateId = Array.isArray(id) ? id[0] : id;
      checkCertificateId(certificateId as string);
    }
  }, [id]);

  if (isValidId === null) {
    return (
      <>
        <NavBar />
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url('https://cdn.svgator.com/images/2024/01/svgator-bird-alligator-cta.gif') no-repeat center center`,
            backgroundSize: "cover",
            zIndex: 9999,
          }}
        />
        <Footer />
      </>
    );
  }

  if (isValidId === false) {
    return <Custom404 />;
  }

  const certificateId = Array.isArray(id) ? id[0] : id;
  const certificateImageUrl = `https://res.cloudinary.com/dgjnslagz/image/upload/v1/certificates/${certificateId}`;

  const handleDownload = () => {
    const pdfUrl = `/api/generate-pdf?imageUrl=${encodeURIComponent(certificateImageUrl)}&fileName=${certificateId}.pdf`;
  
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col min-screen bg-black pb-10">
        <div className="flex-grow bg-black mb-6">
          <h1 className="text-4xl text-white text-center mb-10 mt-10">Your Certificate</h1>

          <Image
            src={certificateImageUrl}
            alt={`certificate-${certificateId}`}
            className="mx-auto mb-3 pb-3 sm:mb-0 rounded-lg"
            width={800}
            height={400}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleDownload}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-500 transition-colors"
          >
            Download Certificate as PDF
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Certificate;
