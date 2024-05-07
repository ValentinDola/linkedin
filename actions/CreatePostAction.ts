// Import necessary modules and types
"use server";
import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "../types/user";
import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import { BlobServiceClient } from "@azure/storage-blob";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

// Define an async function to create a new post
export default async function CreatePostAction(formData: FormData) {
  // Get the current user
  const user = await currentUser();

  // Extract post input and image from form data
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url: string | undefined = undefined;

  // Validate user authentication and input
  if (!user?.id) {
    throw new Error("User is not authenticated");
  }
  if (!postInput) {
    throw new Error("Post input is required");
  }

  // Create a user object for the database
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    if (image?.size > 0) {
      // Upload image to Azure Blob Storage if an image is provided
      console.log("Uploading image to Azure Blob Storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;
      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Generate a unique filename using UUID and current timestamp
      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      image_url = res._response.request.url;

      console.log("File uploaded successfully!", image_url);

      // Create post in the database with image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };

      await Post.create(body);
    } else {
      // Create post in the database without image if no image is provided
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    }

    console.log("Post created successfully");
  } catch (error) {
    console.log("Failed to create a post: ", error);
  }

  // Revalidate the home page to reflect the new post
  revalidatePath("/");
}
