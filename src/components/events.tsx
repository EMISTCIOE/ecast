import React from "react";
import Link from "next/link"; 
import styles from "./css/event.module.css";

interface IPROPS {
  image: string; 
  topic: string;
  eventId: string;
}

const Events: React.FC<IPROPS> = ({ image, topic, eventId }) => {
  const getReadMoreLink = (eventId: string): string => {
    const links: Record<string, string> = {
      "workshop-on-django": "",
      "coming-soon-2": "#",
      "coming-soon-3": "#",
    };
    return links[eventId] || "#";
  };

  return (
    <div className={styles.semiImage}>
      <img src={image} alt={topic} className={styles.eventImage} />
      <br></br>
      <div className={styles.title1}>{topic}</div>
      <br></br>
      <div className={styles.btnContainer}>
        <div className={styles.buttonContainer1}>
          <Link href={`/register/${eventId}`}>
            Register
          </Link>
        </div>
        <div className={styles.buttonContainer2}>
          <a href={getReadMoreLink(eventId)} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Events;
