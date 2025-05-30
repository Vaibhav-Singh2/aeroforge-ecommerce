import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HeroSection } from "@/components/sections/hero-section";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { ServicesSection } from "@/components/sections/services-section";

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <ServicesSection />

      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose DroneShop?</h2>
            <p className="text-muted-foreground">
              {`We're dedicated to providing the best drones, planes, and accessories with exceptional service.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Quality Products</h3>
              <p className="text-muted-foreground text-sm">
                We carefully select and test all our products to ensure you get
                only the best quality drones and accessories.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Expert Support</h3>
              <p className="text-muted-foreground text-sm">
                Our team of drone enthusiasts is always ready to help with any
                questions or issues you might have.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21.73 18.62a1 1 0 0 1-1.45 1.04L16 17.27V14.5a1 1 0 0 0-1-1H3.1a1 1 0 0 1-1.05-1.04l.53-7.94A2 2 0 0 1 4.57 2.5h12.76a2 2 0 0 1 1.99 2.02l.78 7.47" />
                  <path d="M16 17.27V21a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3.73" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground text-sm">
                We offer quick and reliable shipping options to get your new
                drone to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">From Our Blog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn more about drones, flying techniques, and industry news
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden group">
              <div className="overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={`https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={`Blog post ${i}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Tips & Tricks
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    April 12, 2023
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {`Mastering Drone Photography: A Beginner's Guide`}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  Learn the essential techniques to capture stunning aerial
                  photographs with your drone, from composition to lighting.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/blog">
            <Button variant="outline">View All Articles</Button>
          </Link>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Join Our Newsletter</h2>
              <p className="text-primary-foreground/80">
                Get the latest updates, deals, and drone news straight to your
                inbox.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md text-foreground bg-background border border-input w-full sm:w-64"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
