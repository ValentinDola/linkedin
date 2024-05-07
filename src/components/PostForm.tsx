// Importing necessary dependencies
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  CalendarDays,
  CalendarIcon,
  Camera,
  ChevronRight,
  ImageIcon,
  NewspaperIcon,
  XIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import CreatePostAction from "../../actions/CreatePostAction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import { DatePickerWithRange } from "./DataRangePicker";

// Defining the PostForm component
const PostForm = () => {
  // Using Clerk's useUser hook to get the currently logged-in user
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  // Function to handle image change in the form
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Function to handle post creation action
  const handlePostAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset();

    const text = formDataCopy.get("postInput") as string;

    if (!text) {
      throw new Error("You must provide a post input");
    }

    setPreview(null);

    try {
      await CreatePostAction(formDataCopy);
    } catch (error) {
      console.error(`Error creating post: ${error}`);

      // Display toast
    }
  };

  // Rendering the PostForm component
  return (
    <div className="mb-2">
      <form
        ref={ref}
        action={(formData) => {
          // handle form submission whith server action
          const promise = handlePostAction(formData);
          //Toast notification based on the promise above
          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created!",
            error: (e) => "Error creating post: " + e.message,
          });
        }}
        method="post"
        className="p-3 bg-white rounded-lg border"
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            {user?.id ? (
              <AvatarImage src={imageUrl} />
            ) : (
              <AvatarImage src={"https://github.com/shadcn.png"} />
            )}

            <AvatarFallback>
              {" "}
              {firstName?.charAt(0).toUpperCase()}
              {lastName?.charAt(0)}{" "}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <button hidden type="submit">
            Post
          </button>
        </div>

        <div>
          {/* Preview conditional check */}
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="flex justify-between mt-2 space-x-2">
            {/* Preview */}
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mr-2" size={18} color="#7AB1FF" />
              {preview ? "Change" : null} Image
            </Button>

            {/* Add preview remove button */}
            {preview && (
              <Button
                variant={"ghost"}
                type="button"
                onClick={() => setPreview(null)}
              >
                <XIcon className="mr-2" size={18} color="#F85C50" />
                Remove
              </Button>
            )}

            {!preview && (
              <Dialog>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant={"ghost"}
                    // onClick={() => fileInputRef.current?.click()}
                  >
                    <CalendarDays className="mr-2" size={18} color="#FFC46B" />
                    Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create an event</DialogTitle>
                  </DialogHeader>
                  <Separator orientation="horizontal" />
                  <DialogDescription>
                    <div className="">
                      <div className="flex flex-col cursor-pointer bg-[#F1F2F2] h-64 rounded-sm my-3 justify-center items-center ">
                        <Camera size={50} color="#7EB3FF" />
                        <p>Upload cover image</p>
                        <p>Minimum width 480 pixels, 16:9 recomended</p>
                      </div>
                      <DatePickerWithRange />
                    </div>
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant={"secondary"}
                      // onClick={() => fileInputRef.current?.click()}
                    >
                      Next
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {!preview && (
              <Dialog>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant={"ghost"}
                    // onClick={() => fileInputRef.current?.click()}
                  >
                    <NewspaperIcon className="mr-2" size={18} color="#FE634E" />
                    Write article
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Publish as</DialogTitle>
                  </DialogHeader>
                  <Separator orientation="horizontal" />
                  <DialogDescription className="p-4 flex space-x-2 items-center">
                    <Avatar>
                      {user?.id ? (
                        <AvatarImage src={imageUrl} />
                      ) : (
                        <AvatarImage src={"https://github.com/shadcn.png"} />
                      )}

                      <AvatarFallback>
                        {" "}
                        {firstName?.charAt(0).toUpperCase()}
                        {lastName?.charAt(0)}{" "}
                      </AvatarFallback>
                    </Avatar>
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
                    <div>
                      <RadioGroup defaultValue="option-one">
                        <RadioGroupItem value="option-one" id="option-one" />
                      </RadioGroup>
                    </div>
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant={"secondary"}
                      // onClick={() => fileInputRef.current?.click()}
                    >
                      Next
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

// Exporting the PostForm component as default
export default PostForm;
