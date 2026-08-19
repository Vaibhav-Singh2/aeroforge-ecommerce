import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    name: "Racing & FPV Drones",
    slug: "/category/projects/racing-drones",
    description:
      "High-performance FPV racing and freestyle quadcopters built for extreme speed and agility",
    image:
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "RC Airplanes & Wings",
    slug: "/category/projects/rc-planes",
    description:
      "Fixed-wing aerobatic aircraft, high-speed EDF jets, and long-range autonomous FPV wings",
    image:
      "https://images.unsplash.com/photo-1519074069444-1ba4ea16e828?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Avionics & Flight Stacks",
    slug: "/category/parts-and-accessories/flight-controllers",
    description:
      "High-rate F7/H7 flight controllers, digital HD video transmitters, and long-range telemetry receivers",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Motors & Carbon Frames",
    slug: "/category/parts-and-accessories/motors-escs",
    description:
      "High-torque brushless motors, high-amp ESCs, and precision-cut carbon fiber airframes",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
];

export function CategoryShowcase() {
  return (
    <section className="container py-8">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">Browse Categories</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Explore our wide range of drones, planes, accessories, and parts for
          every need and skill level
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="group overflow-hidden">
            <div className="overflow-hidden">
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
            </div>
            <CardContent className="pt-6">
              <h3 className="mb-2 text-xl font-semibold">{category.name}</h3>
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="group/btn">
                <Link href={category.slug} className="flex items-center gap-1">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
