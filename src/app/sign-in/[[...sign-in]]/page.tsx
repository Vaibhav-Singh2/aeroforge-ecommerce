import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center py-10">
      <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center">
        <div className="grid w-full gap-6">
          <div className="relative flex w-full justify-center">
            <div className="absolute top-0 left-0">
              <Link
                href="/"
                className="text-muted-foreground flex items-center text-sm"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to home
              </Link>
            </div>
            <div className="mt-10 flex w-full justify-center">
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
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
