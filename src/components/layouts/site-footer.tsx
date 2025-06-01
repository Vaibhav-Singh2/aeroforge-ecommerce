import Link from "next/link";
import { Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="bg-muted/40 overflow-hidden px-5">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="h-6 w-6" />
              <span className="text-xl font-bold">
                {"Anubhav Projects's Lab"}
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Your one-stop shop for premium drones, planes, accessories, repair
              services, and 3D printing solutions.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-base font-medium">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/drones"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Drones
                </Link>
              </li>
              <li>
                <Link
                  href="/category/planes"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Planes
                </Link>
              </li>
              <li>
                <Link
                  href="/category/accessories"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/category/parts"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Parts
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Deals & Discounts
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-base font-medium">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/repair"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Repair Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/printing"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  3D Printing
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-base font-medium">Stay Updated</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Subscribe to our newsletter for the latest products and offers.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="max-w-[220px]"
              />
              <Button size="sm">Subscribe</Button>
            </div>
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium">Follow Us</h4>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-youtube"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {`Anubhav Projects's Lab`}. All
              rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
