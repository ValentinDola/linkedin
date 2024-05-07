// Importing necessary dependencies
"use client";
import { IPostDocument } from "@/mongodb/models/post";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  HeartIcon,
  MessageCircle,
  Repeat2,
  Send,
  SmileIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import { CommentForm } from "./CommentForm";
import { CommentFeed } from "./CommentFeed";

// Defining the PostOptions component
export default function PostOptions({
  post,
  postId,
}: {
  post: IPostDocument;
  postId: string;
}) {
  // State for managing whether comments are open or not
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { user } = useUser();
  // State for tracking if the post is liked by the current user
  const [liked, setLiked] = useState(false);
  // State for tracking the number of likes
  const [likes, setLikes] = useState(post.likes);

  // Effect to check if the current user has liked the post
  useEffect(() => {
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [post, user]);

  // Function to like or unlike a post
  const likeOrUnlikePost = async () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const originalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body: LikePostRequestBody | UnlikePostRequestBody = {
      userId: user.id,
    };

    setLiked(!liked);
    setLikes(newLikes);

    const response = await fetch(
      `/api/posts/${postId}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body }),
      }
    );

    if (!response.ok) {
      setLiked(originalLiked);
      throw new Error("Failed to like post");
    }

    const fetchLikesResponse = await fetch(`/api/posts/${postId}/like`);
    if (!fetchLikesResponse.ok) {
      setLikes(originalLikes);
      throw new Error("Failed to fetch likes");
    }

    const newLikesData = await fetchLikesResponse.json();

    setLikes(newLikesData);

    setIsCommentsOpen(true);
  };

  // Rendering the PostOptions component
  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {likes && likes.length > 0 && (
            <div className="text-xs text-gray-500 cursor-pointer hover:underline grid grid-flow-col items-center gap-2">
              <div className="grid grid-flow-col items-center">
                <ThumbsUpIcon size={14} fill="#4881c2" />
                <SmileIcon size={14} fill="yellow" />
                <HeartIcon size={14} fill="red" />
              </div>
              {likes.length}
            </div>
          )}
        </div>

        <div>
          {post?.comments && post.comments.length > 0 && (
            <p
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="text-xs text-gray-500 cursor-pointer hover:underline"
            >
              {post.comments.length} comments
            </p>
          )}
        </div>
      </div>
      <div className="flex p-2 justify-between px-2 border-t">
        <Button
          variant="ghost"
          className="postButton"
          onClick={likeOrUnlikePost}
        >
          {/* If user has liked the post, show filled thumbs up icon */}
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
          />
          Like
        </Button>

        <Button
          variant="ghost"
          className="postButton"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentsOpen && "text-gray-600 fill-gray-600"
            )}
          />
          Comment
        </Button>

        <Button variant="ghost" className="postButton">
          <Repeat2 className="mr-1" />
          Repost
        </Button>

        <Button variant="ghost" className="postButton">
          <Send className="mr-1" />
          Send
        </Button>
      </div>

      {isCommentsOpen && (
        <div className="p-4">
          {user?.id && <CommentForm postId={postId} />}
          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
}
