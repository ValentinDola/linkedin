// Import necessary modules and types
import connectDB from "@/mongodb/db";
import { IUser } from "../../../../types/user";
import { NextResponse } from "next/server";
import { IPostBase, Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";

// Define the structure of the request body for adding a post
export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl?: string | null;
}

// Define a POST request handler to add a new post
export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse request body to get user, text, and imageUrl
    const { user, text, imageUrl }: AddPostRequestBody = await request.json();

    // Create post data object
    const postData: IPostBase = {
      user,
      text,
      ...(imageUrl && { imageUrl }), // Include imageUrl if provided
    };

    // Create a new post in the database
    const post = await Post.create(postData);

    // Return success message and the newly created post
    return NextResponse.json({ message: "Post Created Successfully", post });
  } catch (error) {
    // Return error message and status code 500 if an error occurs
    return NextResponse.json(
      { error: `An error occurred while creating post ${error}` },
      { status: 500 }
    );
  }
}

// Define a GET request handler to fetch all posts
export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all posts from the database
    const posts = await Post.getAllPosts();

    // Return the fetched posts
    return NextResponse.json({ posts });
  } catch (error) {
    // Return error message and status code 500 if an error occurs
    return NextResponse.json(
      { error: `An error occurred while fetching posts ${error}` },
      { status: 500 }
    );
  }
}
