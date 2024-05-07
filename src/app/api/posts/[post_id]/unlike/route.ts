// Import necessary modules and types
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the structure of the request body for unliking a post
export interface UnlikePostRequestBody {
  userId: string;
}

// Define a POST request handler to unlike a post
export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  // Protect the route with authentication
  auth().protect();

  // Get the current user
  const user = await currentUser();

  // Parse the request body
  const { userId }: UnlikePostRequestBody = await request.json();

  // Connect to the database
  await connectDB();

  try {
    // Find the post by ID
    const post = await Post.findById(params.post_id);

    // Return a 404 response if the post is not found
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Unlike the post
    await post.unlikePost(userId);

    // Return a success message
    return NextResponse.json({ message: "Post unliked successfully" });
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while unliking the post" },
      { status: 500 }
    );
  }
}
