// Importing required modules from Mongoose library
import mongoose, { Schema, Document, models, Model } from "mongoose";
// Importing interfaces and types from other files
import { Comment, IComment, ICommentBase } from "./comment";
import { IUser } from "../../../types/user";

// Defining the base structure of a post
export interface IPostBase {
  user: IUser; // User who made the post
  text: string; // Text content of the post
  imageUrl?: string; // Optional URL for an image attached to the post
  comments?: IComment[]; // Array of comments on the post
  likes?: string[]; // Array of user IDs who liked the post
}

// Define the document interface, extending the base and including timestamps
export interface IPost extends IPostBase, Document {
  createdAt: Date; // Timestamp of when the post was created
  updatedAt: Date; // Timestamp of when the post was last updated
}

// Define the document methods (for each instance of a post)
interface IPostMethods {
  likePost(userId: string): Promise<void>; // Method to like the post
  unlikePost(userId: string): Promise<void>; // Method to unlike the post
  commentOnPost(comment: ICommentBase): Promise<void>; // Method to add a comment to the post
  getAllComments(): Promise<IComment[]>; // Method to get all comments on the post
  removePost(): Promise<void>; // Method to remove the post
}

// Define the static methods for the Post model
interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[]>; // Method to get all posts
}

// Merge the document methods, and static methods with IPost
export interface IPostDocument extends IPost, IPostMethods {}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

// Creating a new Mongoose schema for posts
const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      // Subschema for user details
      userId: { type: String, required: true }, // User's ID
      userImage: { type: String, required: true }, // User's image URL
      firstName: { type: String, required: true }, // User's first name
      lastName: { type: String }, // User's last name (optional)
    },
    text: { type: String, required: true }, // Text content of the post
    imageUrl: { type: String }, // URL for an image attached to the post
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] }, // Array of comment IDs
    likes: { type: [String] }, // Array of user IDs who liked the post
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Method to like the post
PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    console.log("error when liking post", error);
  }
};

// Method to unlike the post
PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.log("error when unliking post", error);
  }
};

// Method to remove the post
PostSchema.methods.removePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.log("error when removing post", error);
  }
};

// Method to add a comment to the post
PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
  try {
    const comment = await Comment.create(commentToAdd);
    this.comments.push(comment._id);
    await this.save();
  } catch (error) {
    console.log("error when commenting on post", error);
  }
};

// Method to get all comments on the post
PostSchema.methods.getAllComments = async function () {
  try {
    await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    });
    return this.comments;
  } catch (error) {
    console.log("error when getting all comments", error);
  }
};

// Method to get all posts
PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
      })
      .populate("likes")
      .lean(); // lean() returns a plain JS object instead of a mongoose document

    return posts.map((post: IPostDocument) => ({
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment: IComment) => ({
        ...comment,
        _id: comment._id.toString(),
      })),
    }));
  } catch (error) {
    console.log("error when getting all posts", error);
  }
};

// Exporting the Post model, if it exists, or creating a new model if it doesn't
export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
