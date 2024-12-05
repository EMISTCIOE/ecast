import { Blog } from '../../store/src/index'; // Adjust the import
import Link from 'next/link';
import Moment from 'react-moment';
import clsx from 'clsx'; // Import clsx to combine class names
import styles from "../css/search.module.css";

type BlogNavbarProps = {
  blogs: Blog[];
  categories: string[];
  tags: string[];
};

export const BlogNavbar = ({ blogs }: BlogNavbarProps) => {
  // Sort the blogs by the 'created' date in descending order
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  return (
    <>
      <div className={clsx("text-white", styles["recent-posts-widget"])}>
        <h2 className={styles["recent-posts-heading"]}>Recent Posts</h2>
        <ul>
          {/* Display only the first five posts */}
          {sortedBlogs.slice(0, 5).map((blog, index) => (
            <li key={index} className={styles["post-item"]}>
              <Link href={`/blogs/${blog.uid}`}>
                <h4 className={styles["post-title"]}>{blog.title}</h4>
              </Link>
              <p className={styles["post-description"]}>{blog.description}</p>
              <p className={styles["post-author"]}>By {blog.author}</p>
              <p className={styles["post-time"]}>
                <Moment format="LLL">{blog.modified}</Moment>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
