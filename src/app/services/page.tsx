"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ServicesPage() {
  return (
    <div className="flex w-full flex-col items-center px-5 py-10">
      <h1 className="mb-8 text-center text-4xl font-bold">Our Services</h1>
      <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-center text-lg">
        We offer professional repair services for drones and RC vehicles, as
        well as high-quality 3D printing services to bring your ideas to life.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <CardTitle className="text-2xl">Repair Services</CardTitle>
            <CardDescription>
              Professional drone and RC vehicle repair services
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Expert technicians with years of experience
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Quick turnaround times on most repairs
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Genuine parts and quality workmanship
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                30-day warranty on all repair work
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Free diagnosis with approved repairs
              </li>
            </ul>
            <p className="mb-4">
              {`Whether you've crashed your drone, your RC car isn't responding
              properly, or your plane needs a tune-up, our expert technicians
              are here to help get your devices working perfectly again.`}
            </p>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between border-t px-6 py-4">
            <div className="text-lg font-semibold">Starting from ₹999</div>
            <Link href="/services/repair">
              <Button>Learn More</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <CardTitle className="text-2xl">3D Printing Services</CardTitle>
            <CardDescription>
              Custom 3D printing with various materials
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                High-quality professional 3D printers
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Wide range of materials available
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Custom finishing options (painting, sanding)
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Design assistance available
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                Fast turnaround for rush orders
              </li>
            </ul>
            <p className="mb-4">
              From custom drone parts to RC vehicle modifications, or bringing
              your own designs to life, our 3D printing services deliver
              high-quality results with a range of materials to choose from.
            </p>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between border-t px-6 py-4">
            <div className="text-lg font-semibold">Starting from ₹399/hour</div>
            <Link href="/services/3d-printing">
              <Button>Learn More</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* <div className="mx-auto mt-16 max-w-3xl rounded-lg bg-muted p-8">
        <h2 className="mb-4 text-2xl font-semibold">Need Custom Services?</h2>
        <p className="mb-6">
          If you need custom work that doesn't fit into our standard service
          offerings, please contact us. We're happy to discuss custom projects,
          bulk orders, educational workshops, or any other specialized needs.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button variant="outline" size="lg" className="flex-1">
            Contact Us
          </Button>
          <Button size="lg" className="flex-1">
            Request Custom Quote
          </Button>
        </div>
      </div> */}
    </div>
  );
}
