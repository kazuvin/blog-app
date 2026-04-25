// Re-export client-safe utilities for server components
export {
  getAllTags,
  getPostsByTags,
  type PostMeta,
  type SortOption,
  searchPosts,
  sortPosts,
} from "./blog-utils";

// Import pre-generated blog data (generated at build time)
import blogData from "../data/blog-data.json";
import type { PostMeta } from "./blog-utils";

export type Post = PostMeta & {
  content: string;
};

type BlogDataType = {
  posts: PostMeta[];
  postContents: Record<string, Post>;
};

const data = blogData as BlogDataType;

export function getSortedPostsData(): PostMeta[] {
  return data.posts;
}

export function getAllPostSlugs(): string[] {
  return data.posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = data.postContents[slug];
  return post ?? null;
}
