// Importing necessary dependencies
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IPostDocument } from "@/mongodb/models/post";

// Defining the type for the props
type Props = {};

// Defining the UserInformation component
const UserInformation = async ({ posts }: { posts: IPostDocument[] }) => {
  // Getting the current user's information
  const user = await currentUser();

  // Extracting the user's first name, last name, and image URL
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  // Filtering the posts to get only the posts created by the user
  const userPosts = posts?.filter((post) => post.user.userId === user?.id);

  // Mapping and flattening the comments to get only the user's comments
  const userCommments = posts.flatMap(
    (post) =>
      post?.comments?.filter((comment) => comment.user.userId === user?.id) ||
      []
  );

  // Rendering the UserInformation component
  return (
    <div className="sticky top-[80px]">
      <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4">
        <Avatar>
          {user?.id ? (
            <AvatarImage sizes="" src={imageUrl} />
          ) : (
            <AvatarImage src={"https://github.com/shadcn.png"} />
          )}

          <AvatarFallback>
            {" "}
            {firstName?.charAt(0).toUpperCase()}
            {lastName?.charAt(0)}{" "}
          </AvatarFallback>
        </Avatar>

        <SignedIn>
          <div className="text-center">
            <p className="font-semibold">
              {firstName} {lastName}
            </p>

            <p className="text-xs">
              @{firstName}
              {lastName}-{user?.id?.slice(-4)}
            </p>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="text-center space-y-2">
            <p className="font-semibold"> You are not signed in </p>

            <Button asChild variant={"outline"}>
              <SignInButton>Sign in</SignInButton>
            </Button>
          </div>
        </SignedOut>

        <SignedIn>
          <hr className="w-full border-gray-200 my-5" />

          <div className="flex justify-between w-full px-4 text-xs">
            <p className="font-semibold text-gray-400">Posts</p>
            <p className="text-blue-400">{userPosts.length}</p>
          </div>

          <div className="flex justify-between w-full px-4 text-xs">
            <p className="font-semibold text-gray-400">Comments</p>
            <p className="text-blue-400">{userCommments.length}</p>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default UserInformation;
