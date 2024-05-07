// Import necessary modules and types
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define a GET request handler to retrieve a post by ID
export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  // Connect to the database
  await connectDB();

  try {
    // Find the post by ID
    const post = await Post.findById(params.post_id);

    // Return a 404 response if the post is not found
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Return the post
    return NextResponse.json(post);
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while fetching the post" },
      { status: 500 }
    );
  }
}

// Define the structure of the request body for deleting a post
export interface DeletePostRequestBody {
  userId: string;
}

// Define a DELETE request handler to delete a post
export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  // Protect the route with authentication
  auth().protect();

  // Get the current user
  const user = await currentUser();

  // Connect to the database
  await connectDB();

  try {
    // Find the post by ID
    const post = await Post.findById(params.post_id);

    // Return a 404 response if the post is not found
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the post belongs to the current user
    if (post.user.userId !== user?.id) {
      throw new Error("Post does not belong to the user");
    }

    // Remove the post
    await post.removePost();
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while fetching the post" },
      { status: 500 }
    );
  }
}
