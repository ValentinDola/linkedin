// Import necessary modules and types
"use server";
import { Followers } from "@/mongodb/models/followers";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Define an async function to follow a user
export async function Follow(followingId: string, followerId: string) {
  // Get the current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // If the follower relationship does not exist, create it
    await Followers.follow(followerId, followingId);
  } catch (error) {
    throw new Error("An error occurred while following the user");
  }
}

// Define an async function to get users that the current user is following
export async function GetFollowing(userId: string) {
  // Get the current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Get all users that the current user is following
    await Followers.getAllFollowing(userId);

    // Revalidate the home page to reflect the updated following list
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while following the user");
  }
}
