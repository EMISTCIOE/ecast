import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Blog } from '../../store/src/lib/blog/types';
import styles from "../../components/css/file1.module.css"; // Import the CSS module
import Navbar from '@/components/nav'; // Updated Navbar import
import Footer from '@/components/footar';

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-black w-full">
      <div className={`${styles["semi-container9"]} px-4 lg:px-8`}>
        <h1 className="text-white text-center text-3xl font-bold my-8">Blog List</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-9">
          {blogs.map((blog) => (
            <div key={blog.uid} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <Link href={`/blogs/${blog.uid}`}>
                <div>
                  {/* Blog Thumbnail */}
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-auto rounded-md mb-4"
                  />
                  {/* Blog Title */}
                  <h2 className="text-white text-2xl font-semibold mb-2">
                    {blog.title}
                  </h2>
                </div>
              </Link>
              {/* Metadata Section */}
              <div className="text-gray-400 text-sm mb-4">
                <p>
                  <span className="font-semibold text-gray-300">Author:</span> {blog.author}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Published:</span> {blog.created}
                </p>
              </div>
              {/* Blog Description */}
              <p className="text-gray-300 mb-4">{blog.description}</p>
              {/* Read More Link */}
              <Link
                href={`/blogs/${blog.uid}`}
                className="text-blue-500 hover:underline"
              >
                Read more...
              </Link>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogsDirectory = path.join(process.cwd(), 'src/blogs');
  const filenames = fs.readdirSync(blogsDirectory);

  const blogs = filenames.map((filename) => {
    const filePath = path.join(blogsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    // Ensure modified exists and fallback to created if not present
    const modifiedDate = data.modified ? data.modified : data.created;

    return {
      ...data,
      uid: filename.replace(/\.mdx$/, ''),
      modified: modifiedDate, // Assign a value for modified
    };
  });

  // Sort blogs by the 'modified' date (assuming 'modified' is a valid date string)
  blogs.sort((a, b) => {
    const dateA = new Date(a.modified);
    const dateB = new Date(b.modified);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
  });

  return {
    props: {
      blogs,
    },
  };
};

export default BlogList;
