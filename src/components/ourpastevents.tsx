import { useEffect, useState } from "react";
import PastEventComp from "./pasteventcomp";
import styles from "./css/file2.module.css";

type EventItem = {
  slug: string;
  title: string;
  image: string;
  coming_soon: boolean;
  status: string;
  date?: string;
  location?: string;
  description?: string;
};
const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const OurPastEvents = () => {
  const [items, setItems] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/app/event/list?status=APPROVED");
        const data = await r.json();
        const mapped: EventItem[] = (data || [])
          .filter((e: any) => !e.coming_soon)
          .map((e: any) => ({
            slug: e.slug,
            title: e.title,
            image: e.image?.startsWith("http") ? e.image : `${base}${e.image}`,
            coming_soon: e.coming_soon,
            status: e.status,
            date: e.date,
            location: e.location,
            description: e.description,
          }));
        setItems(mapped);
      } catch {}
    })();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-black text-white pt-10">
        <p className="text-center font-bold text-xl">OUR PAST EVENTS</p>
        <div className="w-1/2 lg:w-1/4 mx-auto border-t-1 border-b-2 border-red-800 my-4"></div>
      </div>

      <div className={styles["semiContainer1"]}>
        <div className={styles["container2"]}>
          {items.map((ev) => (
            <div key={ev.slug} className={styles["semi-container1"]}>
              <PastEventComp
                image={ev.image}
                topic={ev.title}
                date={ev.date}
                location={ev.location}
                description={ev.description}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OurPastEvents;
