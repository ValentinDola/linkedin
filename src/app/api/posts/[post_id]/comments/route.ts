// Import necessary modules and types
import connectDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { IUser } from "../../../../../../types/user";

// Define a GET request handler to retrieve comments for a post
export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    // Protect the route with authentication
    auth().protect();

    // Connect to the database
    await connectDB();

    // Find the post by ID
    const post = await Post.findById(params.post_id);

    // Return a 404 response if the post is not found
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get all comments for the post
    const comments = await post.getAllComments();
    return NextResponse.json(comments);
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while getting the comments" },
      { status: 500 }
    );
  }
}

// Define the structure of the request body for adding a comment
export interface AddCommentRequestBody {
  user: IUser;
  text: string;
}

// Define a POST request handler to add a comment to a post
export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  // Protect the route with authentication
  auth().protect();

  // Parse the request body
  const { user, text }: AddCommentRequestBody = await request.json();

  // Connect to the database
  await connectDB();

  try {
    // Find the post by ID
    const post = await Post.findById(params.post_id);

    // Return a 404 response if the post is not found
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a comment object
    const comment: ICommentBase = {
      user,
      text,
    };

    // Add the comment to the post
    await post.commentOnPost(comment);

    // Return a success message
    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    // Return a 500 response if an error occurs
    return NextResponse.json(
      { error: "An error occurred while adding the comment" },
      { status: 500 }
    );
  }
}
