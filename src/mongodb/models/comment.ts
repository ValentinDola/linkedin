// Importing required modules from Mongoose library
import mongoose, { Schema, Document, Model, models } from "mongoose";
// Importing IUser interface from a file located at "../../../types/user"
import { IUser } from "../../../types/user";

// Defining the basic structure of a comment
export interface ICommentBase {
  user: IUser; // User who made the comment
  text: string; // Text content of the comment
}

// Extending the ICommentBase interface to include timestamps for creation and update
export interface IComment extends Document, ICommentBase {
  createdAt: Date; // Timestamp of when the comment was created
  updatedAt: Date; // Timestamp of when the comment was last updated
}

// Creating a new Mongoose schema for comments
const commentSchema = new Schema<IComment>(
  {
    user: {
      // Subschema for user details
      userId: { type: String, required: true }, // User's ID
      userImage: { type: String, required: true }, // User's image URL
      firstName: { type: String, required: true }, // User's first name
      lastName: { type: String }, // User's last name (optional)
    },
    text: { type: String, required: true }, // Text content of the comment
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Exporting the Comment model, if it exists, or creating a new model if it doesn't
export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", commentSchema);
