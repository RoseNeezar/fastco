import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { queryKey } from "../util/queryKey";

interface Post {
  id: number;
  title: string;
  body: string;
}

const useGetPost = () => {
  const {
    data: posts,
    isLoading,
    fetchStatus,
    refetch,
  } = useQuery<Post[]>({
    queryKey: [queryKey.postList],
    queryFn: async () => {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return result.data;
    },
    enabled: false,
  });

  return {
    posts,
    isLoading: isLoading && fetchStatus !== "idle",
    refetch,
  };
};

const Q1: React.FC = () => {
  const { refetch, posts, isLoading } = useGetPost();

  return (
    <div>
      <div className="flex items-center">
        <h1 className="font-bold text-2xl">Posts</h1>
        <button className="btn ml-3" onClick={() => refetch()}>
          Fetch
        </button>
      </div>
      {!posts && !isLoading && <h1>No data</h1>}
      {isLoading && <progress className="progress w-56"></progress>}
      {posts && !isLoading && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Q1;
