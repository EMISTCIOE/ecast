import React from "react";
import styles from "../components/css/upcoming.module.css";
import OurPastEvents from "../components/ourpastevents";
import UpcomingEvents from "../components/upcomingevent";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

const WholeEvents: React.FC = () => {
  return (
    <>
    <NavBar />
    <div className={`${styles["wholeEventsContainer"]} flex flex-col items-center bg-black overflow-hidden`}>
      <UpcomingEvents />
      <OurPastEvents />
    </div>
    <Footer />
    </>
  );
};

export default WholeEvents;
