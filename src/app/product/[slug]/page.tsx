import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Star,
  Share2,
  Truck,
  Clock,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

// Mock data - would come from database in real app
const product = {
  id: "p1",
  name: "AeroDrone Pro X5",
  slug: "aerodrone-pro-x5",
  description:
    "The AeroDrone Pro X5 is a professional-grade drone designed for aerial photography and videography. With its advanced features and high-performance capabilities, it's perfect for professionals and enthusiasts alike.",
  shortDesc: "Professional-grade drone with 4K camera",
  price: 599.99,
  comparePrice: 699.99,
  images: [
    "https://images.pexels.com/photos/10944048/pexels-photo-10944048.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/9784773/pexels-photo-9784773.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/6249414/pexels-photo-6249414.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  category: {
    name: "projects",
    slug: "/category/projects",
  },
  rating: 4.8,
  reviewCount: 124,
  isBestseller: true,
  isNew: false,
  inStock: true,
  quantity: 25,
  sku: "DRONE-PRO-X5",
  specifications: {
    "Flight Time": "30 minutes",
    Range: "8 km",
    Camera: "4K Ultra HD",
    "Max Speed": "72 km/h",
    Weight: "570g",
    Dimensions: "350 x 350 x 80 mm",
    Battery: "5200 mAh LiPo",
    "Charging Time": "60 minutes",
  },
  features: [
    "4K Ultra HD camera with 3-axis gimbal",
    "Advanced obstacle avoidance system",
    "30-minute flight time",
    "8 km transmission range",
    "Intelligent flight modes",
    "Foldable design for easy transport",
    "Follow Me mode",
    "Return to Home function",
  ],
  variants: [
    {
      id: "v1",
      name: "Standard",
      price: 599.99,
      inStock: true,
    },
    {
      id: "v2",
      name: "Pro Bundle (Extra Batteries + Case)",
      price: 749.99,
      inStock: true,
    },
    {
      id: "v3",
      name: "Ultimate Bundle (Extra Batteries + Case + ND Filters)",
      price: 849.99,
      inStock: false,
    },
  ],
  reviews: [
    {
      id: "r1",
      user: "John D.",
      rating: 5,
      title: "Amazing drone for the price",
      comment:
        "I've been using this drone for 3 months and I'm extremely impressed with its performance. The camera quality is excellent and the battery life is great.",
      date: "2023-03-15",
    },
    {
      id: "r2",
      user: "Sarah M.",
      rating: 4,
      title: "Great drone, minor issues",
      comment:
        "The drone flies beautifully and the camera is excellent. The only reason I'm giving it 4 stars is because the app occasionally disconnects.",
      date: "2023-02-28",
    },
    {
      id: "r3",
      user: "Mike T.",
      rating: 5,
      title: "Professional quality results",
      comment:
        "As a professional photographer, I'm very impressed with the quality of footage I can get with this drone. Highly recommended!",
      date: "2023-01-12",
    },
  ],
};

export default function ProductPage() {
  return (
    <div className="container px-5 py-8">
      {/* Breadcrumbs */}
      <div className="text-muted-foreground mb-6 flex items-center text-sm">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link href={product.category.slug} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </AspectRatio>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="hover:border-primary cursor-pointer overflow-hidden rounded-md border"
              >
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              {product.isBestseller && (
                <Badge className="bg-amber-600 hover:bg-amber-700">
                  Bestseller
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-blue-600 hover:bg-blue-700">New</Badge>
              )}
              {product.comparePrice && <Badge variant="secondary">Sale</Badge>}
              <span className="text-muted-foreground text-sm">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground fill-muted"}`}
                  />
                ))}
                <span className="text-muted-foreground ml-2 text-sm">
                  {product.reviewCount} reviews
                </span>
              </div>

              <div className="flex items-center text-sm">
                <div
                  className={`mr-1 h-3 w-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>
            </div>

            <div className="mb-4 flex items-end gap-2">
              <span className="text-3xl font-semibold">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-muted-foreground text-lg line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
              {product.comparePrice && (
                <Badge
                  variant="outline"
                  className="ml-2 border-green-600 text-green-600"
                >
                  Save ${(product.comparePrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.shortDesc}</p>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium">Select Bundle</h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`cursor-pointer rounded-md border p-3 transition-colors ${
                      variant.inStock
                        ? "hover:border-primary hover:bg-primary/5"
                        : "cursor-not-allowed opacity-60"
                    } `}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{variant.name}</span>
                      <span>${variant.price.toFixed(2)}</span>
                    </div>
                    {!variant.inStock && (
                      <p className="text-destructive mt-1 text-sm">
                        Out of stock
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex rounded-md border">
              <button className="hover:bg-muted px-3 py-2">-</button>
              <input
                type="number"
                min="1"
                max={product.quantity}
                defaultValue="1"
                className="w-12 border-x text-center focus:outline-none"
              />
              <button className="hover:bg-muted px-3 py-2">+</button>
            </div>
            <Button className="flex-1 gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" title="Add to Wishlist">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Shipping info */}
          <div className="bg-muted/30 space-y-3 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <Truck className="text-muted-foreground h-5 w-5" />
              <div>
                <span className="font-medium">Free Shipping</span>
                <p className="text-muted-foreground text-sm">
                  Orders over $100
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <span className="font-medium">Fast Delivery</span>
                <p className="text-muted-foreground text-sm">
                  1-3 business days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-muted-foreground h-5 w-5" />
              <div>
                <span className="font-medium">1-Year Warranty</span>
                <p className="text-muted-foreground text-sm">
                  Includes parts and service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product details tabs */}
      <div className="mb-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">{product.description}</p>
              <p>
                Designed for professionals and enthusiasts alike, the AeroDrone
                Pro X5 offers unparalleled performance and reliability. Its
                advanced flight controller ensures stable flight in various
                conditions, while the intelligent battery management system
                provides up to 30 minutes of flight time.
              </p>
              <p>
                The integrated 4K Ultra HD camera with a 3-axis gimbal delivers
                smooth, professional-quality footage. With features like
                obstacle avoidance, intelligent flight modes, and a
                user-friendly remote controller, the AeroDrone Pro X5 is the
                perfect tool for capturing stunning aerial imagery.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="py-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-2">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="py-6">
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-primary mt-0.5 h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="reviews" className="py-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className="mr-2 text-4xl font-bold">
                    {product.rating}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground fill-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {product.reviewCount} reviews
                    </span>
                  </div>
                </div>
              </div>
              <Button>Write a Review</Button>
            </div>

            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">{review.title}</h4>
                    <span className="text-muted-foreground text-sm">
                      {review.date}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center">
                    <div className="mr-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground fill-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.user}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link href="#" className="text-primary hover:underline">
                View all {product.reviewCount} reviews
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group overflow-hidden rounded-lg border">
              <div className="overflow-hidden">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={`https://images.pexels.com/photos/${[10944048, 9784773, 1087180, 442589][i]}/pexels-photo-${[10944048, 9784773, 1087180, 442589][i]}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={`Related product ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-medium">
                  {
                    [
                      "SkyMaster 4K Plus",
                      "Mini Explorer Drone",
                      "ProView FPV Goggles",
                      "Carbon Fiber Propellers",
                    ][i]
                  }
                </h3>
                <div className="mb-2 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${j < 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground fill-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground ml-1 text-xs">
                    (86)
                  </span>
                </div>
                <div className="font-semibold">
                  ${[799.99, 299.99, 189.99, 39.99][i]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
