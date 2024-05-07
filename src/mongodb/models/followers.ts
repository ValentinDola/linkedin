// Importing required modules from Mongoose library
import mongoose, { Schema, Document, Model, models } from "mongoose";

// Defining the base structure of a follower relationship
export interface IFollowersBase {
  follower: string; // ID of the follower
  following: string; // ID of the user being followed
}

// Define the document methods (for each instance of a follower relationship)
interface IFollowersMethods {
  unfollow(): Promise<void>; // Method to unfollow a user
}

// Define the document interface, extending the base and including timestamps
export interface IFollowers
  extends IFollowersBase,
    Document,
    IFollowersMethods {
  createdAt: Date; // Timestamp of when the relationship was created
  updatedAt: Date; // Timestamp of when the relationship was last updated
}

// Define the static methods for the Followers model
interface IFollowersStatics {
  follow(follower: string, following: string): Promise<IFollowers>; // Method to follow a user
  getAllFollowers(userId: string): Promise<IFollowers[]>; // Method to get all followers of a user
  getAllFollowing(userId: string): Promise<IFollowers[]>; // Method to get all users a user is following
}

// Merge the document methods and static methods with IFollowers
interface IFollowersModel extends Model<IFollowers>, IFollowersStatics {}

// Creating a new Mongoose schema for followers
const FollowersSchema = new Schema<IFollowers>(
  {
    follower: { type: String, required: true }, // ID of the follower
    following: { type: String, required: true }, // ID of the user being followed
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Method to unfollow a user
FollowersSchema.methods.unfollow = async function () {
  try {
    await this.deleteOne({ _id: this._id });
  } catch (error) {
    console.log("error when unfollowing", error);
  }
};

// Method to follow a user
FollowersSchema.statics.follow = async function (
  follower: string,
  following: string
) {
  try {
    const existingFollow = await this.findOne({ follower, following });

    if (existingFollow) {
      throw new Error("You are already following this user");
    }

    const follow = await this.create({ follower, following });
    return follow;
  } catch (error) {
    console.log("error when following", error);
  }
};

// Method to get all followers of a user
FollowersSchema.statics.getAllFollowers = async function (userId: string) {
  try {
    const followers = await this.find({ following: userId });
    return followers;
  } catch (error) {
    console.log("error when getting all followers", error);
  }
};

// Method to get all users a user is following
FollowersSchema.statics.getAllFollowing = async function (userId: string) {
  try {
    const following = await this.find({ follower: userId });
    return following;
  } catch (error) {
    console.log("error when getting all following", error);
  }
};

// Exporting the Followers model, if it exists, or creating a new model if it doesn't
export const Followers =
  (models.Followers as IFollowersModel) ||
  mongoose.model<IFollowers, IFollowersModel>("Followers", FollowersSchema);
