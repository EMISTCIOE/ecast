import { MDXProvider } from '@mdx-js/react';

// Define the types for the props of your custom components.
const components = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => <h1 className="text-4xl font-bold" {...props} />,
  p: (props: React.HTMLProps<HTMLParagraphElement>) => <p className="text-lg" {...props} />,
};

// Define the type for MDXWrapperProps
interface MDXWrapperProps {
  children: React.ReactNode;
}

// The MDXWrapper component now accepts children and wraps them with the MDXProvider
const MDXWrapper = ({ children }: MDXWrapperProps) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MDXWrapper;
