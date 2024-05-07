// Importing necessary dependencies
"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import TimeAgo from "react-timeago";

// Defining the CommentFeed component
export const CommentFeed = ({ post }: { post: IPostDocument }) => {
  return (
    // Container for comments
    <div className="mt-3 space-y-2">
      {/* Mapping over comments and displaying them */}
      {post?.comments?.map((comment) => (
        <div key={comment._id} className="flex space-x-1">
          {/* User avatar */}
          <Avatar>
            <AvatarImage src={comment.user.userImage} />
            {/* Displaying initials if no image */}
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Comment content */}
          <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
            <div className="flex justify-between">
              {/* User's name */}
              <div>
                <p className="font-semibold">
                  {comment.user.firstName} {comment.user.lastName}
                </p>
                {/* User's username and partial ID */}
                <p className="text-xs text-gray-400">
                  @{comment.user.firstName}
                  {comment.user.firstName}-
                  {comment.user.userId.toString().slice(-4)}
                </p>
              </div>

              {/* Comment timestamp */}
              <p className="text-xs text-gray-400">
                <TimeAgo date={new Date(comment.createdAt)} />
              </p>
            </div>

            {/* Comment text */}
            <p className="mt-3 text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
