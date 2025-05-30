import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Drones",
    slug: "/category/drones",
    description: "Explore our range of premium drones for hobbyists and professionals",
    image: "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Planes",
    slug: "/category/planes",
    description: "Discover RC planes for all skill levels and flying styles",
    image: "https://images.pexels.com/photos/76957/tree-top-view-vista-snow-76957.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Accessories",
    slug: "/category/accessories",
    description: "Essential accessories to enhance your flying experience",
    image: "https://images.pexels.com/photos/4062312/pexels-photo-4062312.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    name: "Parts",
    slug: "/category/parts",
    description: "Replacement parts and components for maintenance and upgrades",
    image: "https://images.pexels.com/photos/6077870/pexels-photo-6077870.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
]

export function CategoryShowcase() {
  return (
    <section className="container py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Browse Categories</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of drones, planes, accessories, and parts for every need and skill level
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group overflow-hidden">
            <div className="overflow-hidden">
              <AspectRatio ratio={4/3}>
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
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
  )
}