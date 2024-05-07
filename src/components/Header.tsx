// Importing necessary dependencies
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Briefcase,
  HomeIcon,
  MessagesSquare,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

// Defining the Header component
const Header = () => {
  return (
    // Header layout
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      {/* Logo */}
      <Image
        className="rounded-lg"
        src={"./logo.svg"}
        width={40}
        height={40}
        alt="logo"
      />

      {/* Search bar */}
      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none"
          />
        </form>
      </div>

      {/* Navigation links */}
      <div className="flex items-center space-x-8 px-6">
        <Link href={"/"} className="icon">
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>

        <Link href={"/"} className="icon hidden md:flex">
          <UserIcon className="h-5" />
          <p>Network</p>
        </Link>

        <Link href={"/"} className="icon hidden md:flex">
          <Briefcase className="h-5" />
          <p>Jobs</p>
        </Link>

        <Link href={"/"} className="icon hidden md:flex">
          <MessagesSquare className="h-5" />
          <p>Jobs</p>
        </Link>

        {/* User Button if signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* Sign In Button if not signed in */}
        <SignedOut>
          <Button asChild variant={"ghost"}>
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </div>
  );
};

// Exporting the Header component as default
export default Header;
