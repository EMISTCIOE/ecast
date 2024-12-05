import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

 
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <>
      <NavBar />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url('https://cdn.svgator.com/images/2024/01/svgator-bird-alligator-cta.gif') no-repeat center center`,
        backgroundSize: 'cover', // Make the image cover the entire screen
        zIndex: 9999, // Ensure it appears on top of other content
      }} />
      <Footer />
      </>
    );
  }
  
  

  return (
    <>
    <NavBar />
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 bg-black p-4 rounded-lg">
      {images && images.length > 0 ? (
        images.map((src, index) => (
          <div key={index} className="mb-3">
            <Image
              src={src} 
              alt={`Gallery image ${index + 1}`} 
              width={500}
              height={300} 
              className="w-full rounded-lg"
            />
          </div>
        ))
      ) : (
        <div>No images available</div> 
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Gallery;
