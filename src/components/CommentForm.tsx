// Importing necessary dependencies
"use client";
import { useUser } from "@clerk/nextjs";
import React, { useRef } from "react";
import createCommentAction from "../../actions/CreateComment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// Defining the CommentForm component
export const CommentForm = ({ postId }: { postId: string }) => {
  // Getting the authenticated user
  const { user } = useUser();
  // Creating a reference for the form element
  const ref = useRef<HTMLFormElement>(null);

  // Binding the postId to the createCommentAction function
  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  // Handling the comment submission
  const handleCommentAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    // Resetting the form
    ref.current?.reset();

    try {
      // Checking if the user is authenticated
      if (!user?.id) throw new Error("User not authenticated");
      // Calling the createCommentAction with the postId and formData
      await createCommentActionWithPostId(formDataCopy);
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
    }
  };

  // Rendering the comment form
  return (
    <form
      ref={ref}
      // Handling form submission
      action={(formData) => {
        const promise = handleCommentAction(formData);
        // Displaying toast messages based on the submission status
        toast.promise(promise, {
          loading: "Posting comment...",
          success: "Comment Posted!",
          error: "Error creating comment",
        });
      }}
      className="flex items-center space-x-1"
    >
      {/* User avatar */}
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        {/* Displaying initials if no image */}
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Comment input */}
      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
        />
        <button type="submit" hidden>
          Comment
        </button>
      </div>
    </form>
  );
};
