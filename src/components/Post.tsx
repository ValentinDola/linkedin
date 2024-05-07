// Importing necessary dependencies
"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import TimeAgo from "react-timeago";
import { Button } from "./ui/button";
import { Trash2, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import DeletePostAction from "../../actions/DeletePostAction";
import Image from "next/image";
import PostOptions from "./PostOptions";
import { Follow } from "../../actions/FollowAction";

// Defining the Post component
export default function Post({ post }: { post: IPostDocument }) {
  // Getting the authenticated user
  const { user } = useUser();

  // State for follow status
  const [follow, setFollow] = React.useState(false);

  // Checking if the current user is the author of the post
  const isAuthor = user?.id === post.user.userId;

  // Extracting user and post information
  const postUserId = post?.user?.userId;
  const userId: any = user?.id;

  return (
    // Rendering the post container
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <div>
          {/* Displaying user avatar */}
          <Avatar>
            <AvatarImage src={post.user.userImage} />
            <AvatarFallback>
              {post.user.firstName?.charAt(0)}
              {post.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex justify-between flex-1">
          <div>
            {/* Displaying user name and author badge if the user is the author */}
            <p className="font-semibold">
              {post.user.firstName} {post.user.lastName}
              {isAuthor && (
                <Badge className="ml-2" variant="secondary">
                  author
                </Badge>
              )}
            </p>

            {/* Displaying user username */}
            <p className="text-xs text-gray-400">
              @{post.user.firstName}
              {post.user.firstName}-{post.user.userId.toString().slice(-4)}
            </p>

            {/* Displaying post creation time */}
            <p className="text-xs text-gray-400">
              <TimeAgo date={new Date(post.createdAt)} />
            </p>
          </div>

          {/* Displaying follow/unfollow button based on user's relationship with the post author */}
          {isAuthor ? (
            // Delete post button for the author
            <Button
              variant={"ghost"}
              onClick={() => {
                const promise = DeletePostAction(post._id);
                toast.promise(promise, {
                  loading: "Deleting post...",
                  success: "Post deleted!",
                  error: "Error deleting post",
                });
              }}
            >
              <Trash2 size={15} />
            </Button>
          ) : follow ? (
            // Unfollow button if already following
            <Button
              variant={"ghost"}
              onClick={() => {
                const promise = Follow(userId, postUserId);
                setFollow(true);
                toast.promise(promise, {
                  loading: "Unfollowing...",
                  success: "Unfollowed!",
                  error: "Error unfollowing this user",
                });
              }}
            >
              unfollow
            </Button>
          ) : (
            // Follow button if not following
            <Button
              variant={"ghost"}
              // onClick={() => {
              //   const promise =
              //   setFollow(true);
              //   toast.promise(promise, {
              //     loading: "Following...",
              //     success: "Followed!",
              //     error: "Error following this user",
              //   });
              // }}
            >
              follow
            </Button>
          )}
        </div>
      </div>
      <div className="">
        {/* Displaying post text */}
        <p className="px-4 pb-2 mt-2">{post.text}</p>{" "}
        {/* Displaying post image if available */}
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt="post image"
            width={500}
            height={500}
            className="w-full mx-auto"
          />
        )}
      </div>
      {/* Component for additional post options */}
      <PostOptions postId={post._id} post={post} />
    </div>
  );
}
