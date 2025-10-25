import React from "react";
import styles from "../components/css/upcoming.module.css";
import OurPastEvents from "../components/ourpastevents";
import UpcomingEvents from "../components/upcomingevent";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

const WholeEvents: React.FC = () => {
  return (
    <>
      <NavBar />
      <div
        className={`${styles["wholeEventsContainer"]} flex flex-col items-center bg-black overflow-hidden`}
      >
        <UpcomingEvents />
        <OurPastEvents />

        {/* Newsletter Subscription */}
        <div className="w-full py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <NewsletterSubscribe
              category="EVENTS"
              title="Subscribe to Event Updates"
              description="Never miss an event! Get notified about upcoming workshops, seminars, competitions, and all ECAST events."
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WholeEvents;
