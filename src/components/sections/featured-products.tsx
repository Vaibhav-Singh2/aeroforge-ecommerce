"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - in a real app, this would come from a database
const mockProducts = {
  featured: [
    {
      id: "p1",
      name: "AeroDrone Pro X5",
      slug: "/product/aerodrone-pro-x5",
      price: 599.99,
      comparePrice: 699.99,
      image:
        "https://images.pexels.com/photos/10944048/pexels-photo-10944048.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Drones",
      rating: 4.8,
      reviewCount: 124,
      isBestseller: true,
      isNew: false,
    },
    {
      id: "p2",
      name: "SkyMaster 4K Plus",
      slug: "/product/skymaster-4k-plus",
      price: 799.99,
      comparePrice: null,
      image:
        "https://images.pexels.com/photos/9784773/pexels-photo-9784773.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Drones",
      rating: 4.7,
      reviewCount: 89,
      isBestseller: false,
      isNew: true,
    },
    {
      id: "p3",
      name: "FlightWing X22 RC Plane",
      slug: "/product/flightwing-x22",
      price: 349.99,
      comparePrice: 399.99,
      image:
        "https://images.pexels.com/photos/53904/pexels-photo-53904.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Planes",
      rating: 4.5,
      reviewCount: 56,
      isBestseller: false,
      isNew: false,
    },
    {
      id: "p4",
      name: "Pro Controller V3",
      slug: "/product/pro-controller-v3",
      price: 129.99,
      comparePrice: null,
      image:
        "https://images.pexels.com/photos/4611435/pexels-photo-4611435.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Accessories",
      rating: 4.9,
      reviewCount: 201,
      isBestseller: true,
      isNew: false,
    },
  ],
  bestsellers: [
    {
      id: "p5",
      name: "Mini Explorer Drone",
      slug: "/product/mini-explorer",
      price: 299.99,
      comparePrice: 349.99,
      image:
        "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Drones",
      rating: 4.6,
      reviewCount: 172,
      isBestseller: true,
      isNew: false,
    },
    {
      id: "p6",
      name: "UltraView 8K Camera",
      slug: "/product/ultraview-8k",
      price: 249.99,
      comparePrice: null,
      image:
        "https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Accessories",
      rating: 4.8,
      reviewCount: 88,
      isBestseller: true,
      isNew: false,
    },
    {
      id: "p4",
      name: "Pro Controller V3",
      slug: "/product/pro-controller-v3",
      price: 129.99,
      comparePrice: null,
      image:
        "https://images.pexels.com/photos/4611435/pexels-photo-4611435.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Accessories",
      rating: 4.9,
      reviewCount: 201,
      isBestseller: true,
      isNew: false,
    },
    {
      id: "p1",
      name: "AeroDrone Pro X5",
      slug: "/product/aerodrone-pro-x5",
      price: 599.99,
      comparePrice: 699.99,
      image:
        "https://images.pexels.com/photos/10944048/pexels-photo-10944048.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Drones",
      rating: 4.8,
      reviewCount: 124,
      isBestseller: true,
      isNew: false,
    },
  ],
  new: [
    {
      id: "p2",
      name: "SkyMaster 4K Plus",
      slug: "/product/skymaster-4k-plus",
      price: 799.99,
      comparePrice: null,
      image:
        "https://images.pexels.com/photos/9784773/pexels-photo-9784773.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Drones",
      rating: 4.7,
      reviewCount: 89,
      isBestseller: false,
      isNew: true,
    },
    {
      id: "p7",
      name: "FlyHigh XR Goggles",
      slug: "/product/flyhigh-xr",
      price: 189.99,
      comparePrice: 219.99,
      image:
        "https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Accessories",
      rating: 4.5,
      reviewCount: 32,
      isBestseller: false,
      isNew: true,
    },
    {
      id: "p8",
      name: "AeroJet 5000 Racing Drone",
      slug: "/product/aerojet-5000",
      price: 459.99,
      comparePrice: null,
      image:
        "https://images.pexels.com/photos/7262397/pexels-photo-7262397.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Drones",
      rating: 4.3,
      reviewCount: 17,
      isBestseller: false,
      isNew: true,
    },
    {
      id: "p9",
      name: "Carbon Fiber Propellers (Set of 4)",
      slug: "/product/carbon-propellers",
      price: 39.99,
      comparePrice: 49.99,
      image:
        "https://images.pexels.com/photos/8885071/pexels-photo-8885071.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Parts",
      rating: 4.6,
      reviewCount: 41,
      isBestseller: false,
      isNew: true,
    },
  ],
};

export function FeaturedProducts() {
  const [tabValue, setTabValue] = useState("featured");

  return (
    <section className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Our Products</h2>

        <Tabs
          defaultValue="featured"
          className="w-full md:w-auto"
          onValueChange={setTabValue}
        >
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
            <TabsTrigger value="new">New Arrivals</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockProducts[tabValue as keyof typeof mockProducts].map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Button asChild>
          <Link
            href={`/category/${tabValue === "featured" ? "all" : tabValue}`}
            className="flex items-center gap-1"
          >
            View All Products <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative overflow-hidden">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-blue-600 hover:bg-blue-700">New</Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-amber-600 hover:bg-amber-700">
              Bestseller
            </Badge>
          )}
          {product.comparePrice && <Badge variant="secondary">Sale</Badge>}
        </div>

        {/* Quick action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>

      <CardContent className="pt-6">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-muted-foreground">
            {product.category}
          </span>
        </div>
        <Link href={product.slug} className="hover:underline">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground fill-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button size="sm" className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
