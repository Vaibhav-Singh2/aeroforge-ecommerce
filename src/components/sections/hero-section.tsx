import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1500"
          alt="Drone flying over mountains"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="from-background/90 to-background/40 absolute inset-0 bg-linear-to-r" />
      </div>

      {/* Content */}
      <div className="relative z-10 container py-20 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="animate-in fade-in slide-in-from-bottom-4 mb-6 text-4xl font-bold tracking-tight duration-700 md:text-5xl lg:text-6xl">
            Explore the World From Above
          </h1>
          <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-5 mb-8 text-lg delay-100 duration-700 md:text-xl">
            Premium drones, planes, and accessories for hobbyists and
            professionals. Capture breathtaking moments with cutting-edge
            technology.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-6 flex flex-col gap-4 delay-200 duration-700 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/category/drones">Shop Drones</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services" className="gap-1">
                Explore Services
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
