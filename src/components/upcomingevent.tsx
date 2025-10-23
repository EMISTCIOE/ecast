import React, { useEffect, useState } from "react";
import styles from "./css/upcoming.module.css";
import styles1 from "./css/file2.module.css";
import Events from "./events";

type EventItem = {
  slug: string;
  title: string;
  image: string;
  coming_soon: boolean;
  status: string;
  form_link?: string | null;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
};

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

const UpcomingEvents: React.FC = () => {
  const [items, setItems] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/app/event/list?status=APPROVED`);
        const data = await r.json();
        const mapped: EventItem[] = (data || [])
          .filter((e: any) => e.coming_soon)
          .map((e: any) => ({
            slug: e.slug,
            title: e.title,
            image: e.image?.startsWith("http") ? e.image : `${base}${e.image}`,
            coming_soon: e.coming_soon,
            status: e.status,
            form_link: e.form_link || null,
            date: e.date,
            time: e.time,
            location: e.location,
            description: e.description,
          }));
        setItems(mapped);
      } catch {}
    })();
  }, []);

  return (
    <>
      {/* Header Section */}
      <div
        className={`${styles["header"]} flex flex-col items-center justify-center`}
      >
        <p className="text-center font-bold text-xl">OUR UPCOMING EVENTS</p>
        <div className={`${styles["divider"]} w-1/2 lg:w-1/4 mx-auto`}></div>
      </div>

      {/* Events Section */}
      <div className={styles["semiContainer1"]}>
        <div
          className={`${styles1["container2"]} ${styles1["centeredContainer"]}`}
        >
          {items.map((event) => (
            <div key={event.slug} className={styles1["semi-container8"]}>
              <Events
                image={event.image}
                topic={event.title}
                eventId={event.slug}
                formLink={event.form_link}
                date={event.date}
                time={event.time}
                location={event.location}
                description={event.description}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpcomingEvents;
