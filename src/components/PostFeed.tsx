// Importing necessary dependencies
import { IPostDocument } from "@/mongodb/models/post";
import React from "react";
import Post from "./Post";

// Defining the PostFeed component
function PostFeed({ posts }: { posts: IPostDocument[] }) {
  // Rendering the PostFeed component
  return (
    // Container for the list of posts with some spacing
    <div className="space-y-2 pb-20">
      {/* Mapping over the list of posts and rendering a Post component for each post */}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

// Exporting the PostFeed component as default
export default PostFeed;
