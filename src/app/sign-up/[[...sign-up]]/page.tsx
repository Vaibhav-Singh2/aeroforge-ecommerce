import Link from "next/link";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="mx-auto mb-4">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={40}
              height={40}
              className="mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to create a new account
          </p>
        </div>

        <div className="grid gap-6">
          <div className="relative">
            <div className="absolute top-0 left-0">
              <Link
                href="/"
                className="text-muted-foreground flex items-center text-sm"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to home
              </Link>
            </div>
            <div className="mt-10">
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                redirectUrl="/checkout"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none w-full p-0",
                    formButtonPrimary:
                      "bg-primary hover:bg-primary/90 text-primary-foreground",
                    footerActionLink: "text-primary hover:text-primary/90",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
