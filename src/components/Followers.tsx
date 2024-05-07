// Importing necessary dependencies
"use client";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { GetFollowing } from "../../actions/FollowAction";

// Defining the Followers component
const Followers = () => {
  // Getting the authenticated user
  const { user } = useUser();

  // Extracting user information
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  return (
    // Rendering the followers section
    <div className="sticky top-[80px]">
      {/* Followers section */}
      <div className=" bg-white ml-6 rounded-lg border py-4 mb-4">
        {/* Displaying content if user is signed in */}
        <SignedIn>
          <div className="pl-4 font-semibold">Followers</div>

          {/* Displaying user information */}
          <div className="p-4 flex space-x-2 items-center">
            {/* User avatar */}
            <Avatar>
              {/* Displaying user avatar if available, else default avatar */}
              {user?.id ? (
                <AvatarImage src={imageUrl} />
              ) : (
                <AvatarImage src={"https://github.com/shadcn.png"} />
              )}

              {/* Displaying user initials if no image */}
              <AvatarFallback>
                {" "}
                {firstName?.charAt(0).toUpperCase()}
                {lastName?.charAt(0)}{" "}
              </AvatarFallback>
            </Avatar>
            {/* Displaying user details */}
            <div className="flex justify-between flex-1">
              <div>
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>

                <p className="text-xs text-gray-400">
                  @{user?.firstName}
                  {user?.firstName}-{user?.id.toString().slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </SignedIn>

        {/* Displaying content if user is signed out */}
        <SignedOut>
          <div className="text-center space-y-2">
            <p className="font-semibold"> You are not signed in </p>

            {/* Button to sign in */}
            <Button asChild variant={"outline"}>
              <SignInButton>Sign in</SignInButton>
            </Button>
          </div>
        </SignedOut>
      </div>
      {/* Following section */}
      <div className=" bg-white ml-6 rounded-lg border py-4">
        {/* Displaying content if user is signed in */}
        <SignedIn>
          <div className="pl-4 font-semibold">Following</div>

          {/* Displaying user information */}
          <div className="p-4 flex space-x-2 items-center">
            {/* User avatar */}
            <Avatar>
              {/* Displaying user avatar if available, else default avatar */}
              {user?.id ? (
                <AvatarImage src={imageUrl} />
              ) : (
                <AvatarImage src={"https://github.com/shadcn.png"} />
              )}

              {/* Displaying user initials if no image */}
              <AvatarFallback>
                {" "}
                {firstName?.charAt(0).toUpperCase()}
                {lastName?.charAt(0)}{" "}
              </AvatarFallback>
            </Avatar>
            {/* Displaying user details */}
            <div className="flex justify-between flex-1">
              <div>
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>

                <p className="text-xs text-gray-400">
                  @{user?.firstName}
                  {user?.firstName}-{user?.id.toString().slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </SignedIn>

        {/* Displaying content if user is signed out */}
        <SignedOut>
          <div className="text-center space-y-2">
            <p className="font-semibold"> You are not signed in </p>

            {/* Button to sign in */}
            <Button asChild variant={"outline"}>
              <SignInButton>Sign in</SignInButton>
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

// Exporting the Followers component as default
export default Followers;
