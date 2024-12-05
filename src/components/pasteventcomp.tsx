import React from "react";
import Link from "next/link";
import Image from "next/image";

interface IPROPS {
  image: string; 
  topic: string;
  loadLink: string;
  secondButtonLink?: string;
}

const PastEventComp: React.FC<IPROPS> = ({ image, topic, loadLink, secondButtonLink }) => {
  const buttonStyles = {
    base: {
      borderRadius: "4px",
      height: "3rem",
      width: "8rem",
      fontSize: "1rem",
      fontWeight: "700",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      marginTop: "10px", 
    },
    buttonContainer2: {
      border: "3px solid rgba(220, 20, 60, 255)", 
      color: "rgba(220, 20, 60, 255)", 
    },
    buttonContainer1: {
      border: "3px solid rgba(220, 20, 60, 255)",
      backgroundColor: "rgba(220, 20, 60, 255)",
      color: "white",
    },
    buttonContainerHover: {
      backgroundColor: "rgba(220, 20, 60, 255)",
      color: "white",
    },
    buttonContainer1Hover: {
      backgroundColor: "transparent",
      color: "rgba(220, 20, 60, 255)",
      border: "3px solid rgba(220, 20, 60, 255)",
    },
  };

  const titleStyle: React.CSSProperties = {
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "600",
    textTransform: "uppercase", 
    letterSpacing: "1px",
    textAlign: "center", 
    marginTop: "15px", 
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px", 
  };

  return (
    <div style={containerStyle}>
      <Image
        src={image}
        alt={topic}
        width={400}
        height={300}
        style={{
          objectFit: 'cover',
          borderRadius: '20px', 
        }}
      />
      <div style={titleStyle}>"{topic}"</div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
  <div style={{ ...buttonStyles.base, ...buttonStyles.buttonContainer2 }}>
    <Link href={loadLink}>
      Read More
    </Link>
  </div>
      </div>
    </div>
  );
};

export default PastEventComp;
