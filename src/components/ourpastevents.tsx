
import PastEventComp from "./pasteventcomp";
import styles from "./css/file2.module.css";

const OurPastEvents = () => {
  return (
    <>
    
      <div className="flex flex-col items-center justify-center bg-black text-white pt-10">
        <p className="text-center font-bold text-xl">OUR PAST EVENTS</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>
      
      <div className={styles["semiContainer1"]}>
        <div className={styles["container2"]}>
            <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/event1.jpg"
              topic="Article Writing Competition"
              loadLink="/blogs/ecast-article-writing-competition-2024"
            />
          </div>
          </div>
          </div>

      <div className={styles["semiContainer1"]}>
        <div className={styles["container2"]}>
          <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/firstcommit.jpg"
              topic="My First Commit"
              loadLink="/blogs/my-first-commit"
            />
          </div>

          <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/linuxworkshop.jpg"
              topic="Linux Workshop"
              loadLink="https://www.facebook.com/ecastthapathali/photos/pb.100079986095247.-2207520000/568360141304281/?type=3"
            />
          </div>
          <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/art.jpg"
              topic="Unleashing the Art of Enquiry"
              loadLink="/blogs/unleashing-the-art-of-enquiry"
            />
          </div>
        </div>
        </div>

        <div className={styles["semiContainer1"]}>
        <div className={styles["container2"]}>
          <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/netbootcamp.jpg"
              topic="ASP.NET Boot Camp"
              loadLink="https://www.facebook.com/photo.php?fbid=257665533576315&set=pb.100079986095247.-2207520000&type=3"
            />
          </div>
          <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/startup.jpg"
              topic="Feasibility of Startups in Nepal"
              loadLink="https://www.facebook.com/photo.php?fbid=269116709097864&set=pb.100079986095247.-2207520000&type=3"
            />
          </div>
          <div className={styles["semi-container1"]}>
            <PastEventComp
              image="/EventsImages/blockchain.jpg"
              topic="Talk Show on Block Chain"
              loadLink="/blogs/talk-show-on-block-chain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OurPastEvents;
