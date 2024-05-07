// Import necessary modules and types
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define a GET request handler to retrieve likes for a post
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

    // Get the likes for the post
    const likes = post.likes;
    return NextResponse.json(likes);
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}

// Define the structure of the request body for liking a post
export interface LikePostRequestBody {
  userId: string;
}

// Define a POST request handler to like a post
export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  // Protect the route with authentication
  auth().protect();

  // Get the current user
  const user = await currentUser();

  // Parse the request body
  const { userId }: LikePostRequestBody = await request.json();

  // Connect to the database
  await connectDB();

  try {
    // Find the post by ID
    const post = await Post.findById(params.post_id);

    // Return a 404 response if the post is not found
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Like the post
    await post.likePost(userId);

    // Return a success message
    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while liking the post" },
      { status: 500 }
    );
  }
}
