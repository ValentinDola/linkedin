// Import necessary modules and types
"use server";
import { DeletePostRequestBody } from "@/app/api/posts/[post_id]/route";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Define an async function to delete a post
export default async function DeletePostAction(postId: string) {
  // Get the current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  // Create a request body with user ID for deletion
  const body: DeletePostRequestBody = {
    userId: user.id,
  };

  // Find the post by ID
  const post = await Post.findById(postId);

  // Throw an error if post is not found
  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the post belongs to the user
  if (post.user.userId !== user.id) {
    throw new Error("Post does not belong to the user");
  }

  try {
    // Remove the post from the database
    await post.removePost();

    // Revalidate the home page to reflect the deleted post
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while deleting the post");
  }
}
