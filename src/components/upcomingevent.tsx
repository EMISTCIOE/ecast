import React from "react";
import styles from "./css/upcoming.module.css"; 
import styles1 from "./css/file2.module.css"; 
import Events from "./events";
import eventdjango from "../../public/assets/event-django.jpg";
import comingsoon from "../../public/assets/EventsImages/comingsoon.png"; 

const UpcomingEvents: React.FC = () => {
  const upcomingEvents = [
    {
      id: "workshop-on-django",
      topic: "Workshop on Django ",
      image: eventdjango, 
    },
    {
      id: "coming-soon-2",
      topic: "Coming Soon",
      image: comingsoon,
    },
    {
      id: "coming-soon-3",
      topic: "Coming Soon",
      image: comingsoon,
    },
  ];

  return (
    <>
      {/* Header Section */}
      <div className={`${styles["header"]} flex flex-col items-center justify-center`}>
        <p className="text-center font-bold text-xl">OUR UPCOMING EVENTS</p>
        <div className={`${styles["divider"]} w-1/2 lg:w-1/4 mx-auto`}></div>
      </div>

      {/* Events Section */}
      <div className={styles["semiContainer1"]}>
        <div className={`${styles1["container2"]} ${styles1["centeredContainer"]}`}>
          {upcomingEvents.map((event) => (
            <div key={event.id} className={styles1["semi-container8"]}>
              <Events
                image={event.image.src} 
                topic={event.topic}
                eventId={event.id}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpcomingEvents;
