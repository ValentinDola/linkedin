// Import necessary modules and types
"use server";
import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "../types/user";
import { AddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import { Post } from "@/mongodb/models/post";
import { ICommentBase } from "@/mongodb/models/comment";
import { revalidatePath } from "next/cache";

// Define an async function to create a new comment
export default async function createCommentAction(
  postId: string, // ID of the post to add the comment to
  formData: FormData // Form data containing the comment input
) {
  // Get the current user
  const user = await currentUser();

  // Extract the comment input from the form data
  const commentInput = formData.get("commentInput") as string;

  // Validate input
  if (!postId) throw new Error("Post id is required");
  if (!commentInput) throw new Error("Comment input is required");
  if (!user?.id) throw new Error("User not authenticated");

  // Create a user object for the database
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  // Create a request body for adding the comment
  const body: AddCommentRequestBody = {
    user: userDB,
    text: commentInput,
  };

  // Find the post to add the comment to
  const post = await Post.findById(postId);

  // Throw an error if the post is not found
  if (!post) throw new Error("Post not found");

  // Create a comment object
  const comment: ICommentBase = {
    user: userDB,
    text: commentInput,
  };

  try {
    // Add the comment to the post
    await post.commentOnPost(comment);

    // Revalidate the home page to reflect the new comment
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while adding comment");
  }
}
