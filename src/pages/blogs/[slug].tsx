import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';
import { BlogNavbar } from '@/components/blogcomponents/blog-navbar.component';
import styles from "../../components/css/file2.module.css";
import React, { useState, useEffect } from 'react';
import { BlogNavbarmob } from '@/components/blogcomponents/nav-mobile';
interface BlogProps {
  blog: {
    title: string;
    author: string;
    description: string;
    thumbnail: string;
    category?: string;
    tag?: string;
  };
  content: MDXRemoteSerializeResult;
  posts: [];
  categories: string[];
  tags: string[];
}

const BlogPost: React.FC<BlogProps> = ({ blog, content, posts, categories, tags }) => {
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
        {!isMobile && (
          <BlogNavbar blogs={posts} categories={categories} tags={tags} />
        )}
        <div className={styles["semi-container9"]}>
          <div className={styles["blog-header"]}>
          <div className='flex justify-center items-center'>
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className={styles["header-image"]}
            />
            </div>
            <h1 className={styles["blog-title"]}>"{blog.title}"</h1>
          </div>
          <div className={styles["blog-content"]}>
            <p className={styles["blog-description"]}>{blog.description}</p>
            <p className={styles["blog-author"]}>-{blog.author}</p>
            <MDXRemote {...content} />
          </div>
        </div>
      </div>
      <div className='bg-black'>
      {isMobile && (
          <BlogNavbarmob blogs={posts} categories={categories} tags={tags} />
        )}
        </div>
        </div>
      <Footer />
    </>
  );
};;

export const getStaticPaths: GetStaticPaths = async () => {
  const blogsDirectory = path.join(process.cwd(), 'src/blogs');
  const filenames = fs.readdirSync(blogsDirectory);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace(/\.mdx$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const filePath = path.join(process.cwd(), 'src/blogs', `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const mdxSource = await serialize(content);

  const blogsDirectory = path.join(process.cwd(), 'src/blogs');
  const filenames = fs.readdirSync(blogsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      ...data,
      uid: filename.replace(/\.mdx$/, ''),
    };
  });

  return {
    props: {
      blog: data,
      content: mdxSource,
      posts,
    },
  };
};

export default BlogPost;
