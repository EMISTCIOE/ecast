export type Post = {
  content: string;
  metadata: Record<string, string>;
  filePath: string;
};

export interface Blog {
  title: string;
  uid: string;
  thumbnail: string;
  category: string;
  tag: string;
  author: string;
  description: string;
  created: string;
  modified: string;
}

export interface IBlogState {
  readonly posts: Post[];
  readonly tags: string[];
  readonly categories: string[];
}
