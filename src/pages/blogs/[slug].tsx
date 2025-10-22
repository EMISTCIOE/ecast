import { GetServerSideProps } from 'next';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';
import styles from "../../components/css/file2.module.css";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
interface BlogProps {
  blog: {
    title: string;
    author: string;
    description: string;
    thumbnail: string;
    content: string;
  };
}

const BlogPost: React.FC<BlogProps> = ({ blog }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <NavBar />
      <div className='bg-black w-full'>
      <div className="flex justify-center bg-black w-full">
        {/* Optional: related posts sidebar could go here */}
        <div className={styles["semi-container9"]}>
          <div className={styles["blog-header"]}>
          <div className='flex justify-center items-center'>
          <Image
                  src={blog.thumbnail} // Use the thumbnail from blog data
                  alt={blog.title}
                  className={styles["header-image"]}
                  width={800} // Provide a default width
                  height={400} // Provide a default height (adjust as needed)
                  layout="responsive" // Ensures the image is responsive
                />
            </div>
            <h1 className={styles["blog-title"]}>"{blog.title}"</h1>
          </div>
          <div className={styles["blog-content"]}>
            <p className={styles["blog-description"]}>{blog.description}</p>
            <p className={styles["blog-author"]}>-{blog.author}</p>
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>
        </div>
      </div>
      <div className='bg-black'>
      {/* Optional: mobile nav for blogs */}
        </div>
        </div>
      <Footer />
    </>
  );
};;

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const { slug } = params as { slug: string };
  const host = req?.headers?.host || 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  try {
    const res = await fetch(`${protocol}://${host}/api/app/blog/detail?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('not found');
    const it = await res.json();
    const blog = {
      title: it.title,
      author: it.author_username,
      description: it.description || '',
      thumbnail: it.cover_image || '/assets/placeholder.png',
      content: it.content,
    };
    return { props: { blog } };
  } catch (e) {
    return { notFound: true };
  }
};

export default BlogPost;
