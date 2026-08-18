import Link from "next/link";
import { Plane, Mail, Globe } from "lucide-react";

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
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">
                {"AeroForge Labs"}
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Advanced e-commerce & rapid prototyping platform for high-performance
              drones, RC aeronautics, precision parts, on-demand 3D printing, and hardware repair.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span>Built by <strong className="text-foreground font-semibold">Vaibhav Singh</strong></span>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-base font-medium">Shop Catalog</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/drones"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Ready-to-Fly Drones
                </Link>
              </li>
              <li>
                <Link
                  href="/category/planes"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  RC Airplanes
                </Link>
              </li>
              <li>
                <Link
                  href="/category/accessories"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Electronics & Avionics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/parts"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Replacement Parts
                </Link>
              </li>
              <li>
                <Link
                  href="/category/projects"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Engineering Projects
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-base font-medium">Services & Tech</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/3d-printing"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  On-Demand 3D Printing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/repair"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Diagnostics & Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="mb-4 text-base font-medium">Connect & Source</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Explore the source code, architecture, and connect with the developer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/Vaibhav-Singh2"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background text-muted-foreground hover:text-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium shadow-xs transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub</span>
              </Link>
              <Link
                href="https://github.com/Vaibhav-Singh2/aeroforge-ecommerce"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background text-muted-foreground hover:text-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium shadow-xs transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Repository</span>
              </Link>
              <Link
                href="mailto:vaibhav.fullstack.dev@gmail.com"
                className="bg-background text-muted-foreground hover:text-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium shadow-xs transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {`AeroForge Labs`}. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="https://github.com/Vaibhav-Singh2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Developer Profile
            </Link>
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
          </div>
        </div>
      </div>
    </footer>
  );
}

