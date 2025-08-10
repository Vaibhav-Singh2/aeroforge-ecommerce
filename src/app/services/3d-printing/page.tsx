"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { FileUpload } from "@/components/ui/file-upload";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrintingServicesPage() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [infill, setInfill] = useState(20);
  const [layerHeight, setLayerHeight] = useState(0.2);
  const [printQuality, setPrintQuality] = useState("normal");
  const [isRush, setIsRush] = useState(false);
  const [needsSupports, setNeedsSupports] = useState(false);
  const [postProcessingOptions, setPostProcessingOptions] = useState<string[]>(
    [],
  );
  const [files, setFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [printNumber, setPrintNumber] = useState<string | null>(null);
  const router = useRouter();

  const handlePostProcessingChange = (option: string) => {
    setPostProcessingOptions((current) => {
      if (current.includes(option)) {
        return current.filter((item) => item !== option);
      } else {
        return [...current, option];
      }
    });
  };

  const handleSubmitPrintRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check required fields
    if (!projectName || !material) {
      setError("Please fill out all required fields.");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one model file.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit print request to the API
      const response = await fetch("/api/print-orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          description,
          quantity,
          material,
          color,
          infill,
          layerHeight,
          printQuality,
          isRush,
          needsSupports,
          postProcessingOptions,
          fileUrls: files.map((file) => file.url),
          images, // These are already Blob URLs stored in Vercel Blob storage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit print request");
      }

      // Set success state and print number
      setSuccess(true);
      setPrintNumber(data.printOrder.printNumber);

      // Reset the form
      setProjectName("");
      setDescription("");
      setQuantity(1);
      setMaterial("");
      setColor("");
      setInfill(20);
      setLayerHeight(0.2);
      setPrintQuality("normal");
      setIsRush(false);
      setNeedsSupports(false);
      setPostProcessingOptions([]);
      setFiles([]);
      setImages([]);

      // After 3 seconds, redirect to the print orders page
      setTimeout(() => {
        router.push("/account/print-orders");
      }, 3000);
    } catch (error) {
      console.error("Error submitting print request:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">3D Printing Services</h1>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>High-Quality Prints</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We use professional-grade 3D printers to ensure exceptional detail
              and durability in every print.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wide Range of Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {`From standard PLA to specialty materials like Carbon Fiber and
              Wood-fill, we've got your project covered.`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Finishing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Take your prints to the next level with our professional
              post-processing options including sanding, painting, and assembly.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            How Our 3D Printing Process Works
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                1
              </div>
              <div>
                <h3 className="font-medium">Upload Your Design</h3>
                <p className="text-muted-foreground">
                  Upload your STL or OBJ files and provide details about your
                  project requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                2
              </div>
              <div>
                <h3 className="font-medium">Receive a Quote</h3>
                <p className="text-muted-foreground">
                  Our team will review your design and send you a detailed quote
                  based on material, size, and complexity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                3
              </div>
              <div>
                <h3 className="font-medium">Approve and Print</h3>
                <p className="text-muted-foreground">
                  Once you approve the quote and make a payment, we&apos;ll
                  begin printing your design.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                4
              </div>
              <div>
                <h3 className="font-medium">Delivery</h3>
                <p className="text-muted-foreground">
                  {" "}
                  {`We&apos;ll notify you when your print is ready for pickup or
                  shipping.`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
            <h3 className="mb-2 font-medium">Material Options</h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>PLA - Economical, great for most projects</li>
              <li>ABS - Durable with higher heat resistance</li>
              <li>PETG - Strong with good flexibility</li>
              <li>TPU - Flexible rubber-like material</li>
              <li>Wood Fill - PLA infused with wood particles</li>
              <li>Carbon Fiber - PLA with carbon fiber reinforcement</li>
              <li>Metal Fill - PLA infused with metal particles</li>
              <li>Resin - Highly detailed photopolymer resin prints</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            Request a 3D Print Quote
          </h2>

          <form onSubmit={handleSubmitPrintRequest} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="projectName" className="font-medium">
                Project Name*
              </label>
              <Input
                id="projectName"
                placeholder="Name your 3D printing project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="font-medium">
                Project Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe your project and any special requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Upload 3D Model Files*</label>
              <FileUpload
                value={files}
                onChange={setFiles}
                maxFiles={5}
                acceptedFileTypes=".stl,.obj"
                maxSizeInMB={50}
              />
              <p className="text-muted-foreground mt-2 text-sm">
                Please upload your STL or OBJ files. Max file size: 50MB per
                file.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-medium">
                Upload Reference Images (Optional)
              </label>
              <ImageUpload
                value={images}
                onChange={setImages}
                maxFiles={3}
                folder="print-orders/images"
              />
              <p className="text-muted-foreground mt-2 text-sm">
                Images showing what you expect the final print to look like.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="material" className="font-medium">
                  Material*
                </label>
                <Select
                  value={material}
                  onValueChange={(value) => setMaterial(value)}
                  required
                >
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLA">PLA</SelectItem>
                    <SelectItem value="ABS">ABS</SelectItem>
                    <SelectItem value="PETG">PETG</SelectItem>
                    <SelectItem value="TPU">TPU (Flexible)</SelectItem>
                    <SelectItem value="WOOD_FILL">Wood Fill</SelectItem>
                    <SelectItem value="METAL_FILL">Metal Fill</SelectItem>
                    <SelectItem value="CARBON_FIBER">Carbon Fiber</SelectItem>
                    <SelectItem value="RESIN">Resin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="color" className="font-medium">
                  Color
                </label>
                <Input
                  id="color"
                  placeholder="e.g., Red, Blue, Black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="quantity" className="font-medium">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="infill" className="font-medium">
                  Infill Percentage
                </label>
                <Input
                  id="infill"
                  type="number"
                  min="10"
                  max="100"
                  value={infill}
                  onChange={(e) => setInfill(parseInt(e.target.value) || 20)}
                />
                <p className="text-muted-foreground text-xs">
                  Higher values = stronger prints, but more material used.
                  Default: 20%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="layerHeight" className="font-medium">
                  Layer Height
                </label>
                <Select
                  value={layerHeight.toString()}
                  onValueChange={(value) => setLayerHeight(parseFloat(value))}
                >
                  <SelectTrigger id="layerHeight">
                    <SelectValue placeholder="Select layer height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">
                      0.1mm (High Detail, Slower)
                    </SelectItem>
                    <SelectItem value="0.2">0.2mm (Standard)</SelectItem>
                    <SelectItem value="0.3">
                      0.3mm (Fast, Less Detail)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="printQuality" className="font-medium">
                  Print Quality
                </label>
                <Select
                  value={printQuality}
                  onValueChange={(value) => setPrintQuality(value)}
                >
                  <SelectTrigger id="printQuality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (Fastest)</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High (Slowest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Options</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRush"
                    checked={isRush}
                    onCheckedChange={(checked) => setIsRush(!!checked)}
                  />
                  <label htmlFor="isRush" className="text-sm">
                    Rush Order (additional fee applies)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needsSupports"
                    checked={needsSupports}
                    onCheckedChange={(checked) => setNeedsSupports(!!checked)}
                  />
                  <label htmlFor="needsSupports" className="text-sm">
                    Add Support Structures
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Post-Processing Options</label>
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sanding"
                    checked={postProcessingOptions.includes("sanding")}
                    onCheckedChange={() =>
                      handlePostProcessingChange("sanding")
                    }
                  />
                  <label htmlFor="sanding" className="text-sm">
                    Sanding
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="painting"
                    checked={postProcessingOptions.includes("painting")}
                    onCheckedChange={() =>
                      handlePostProcessingChange("painting")
                    }
                  />
                  <label htmlFor="painting" className="text-sm">
                    Painting
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assembly"
                    checked={postProcessingOptions.includes("assembly")}
                    onCheckedChange={() =>
                      handlePostProcessingChange("assembly")
                    }
                  />
                  <label htmlFor="assembly" className="text-sm">
                    Assembly
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {success && printNumber && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Print Request Submitted!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your print request number is{" "}
                        <span className="font-bold">{printNumber}</span>.
                        We&apos;ll contact you with a quote soon. Redirecting to
                        your print orders...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? "Submitting..." : "Submit 3D Print Request"}
            </Button>
            <p className="text-muted-foreground text-sm">
              By submitting this form, you agree to our 3D printing service
              terms and conditions.
            </p>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">What file formats do you accept?</h3>
            <p className="text-muted-foreground mt-1">
              {" "}
              {`We accept STL and OBJ files. If you have a different format,
              please contact us and we&apos;ll see if we can work with it.`}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">How long does a typical print take?</h3>
            <p className="text-muted-foreground mt-1">
              Print time depends on the size, complexity, and quality settings.
              Small items might take a few hours, while larger or more detailed
              prints can take several days.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Do you offer design services?</h3>
            <p className="text-muted-foreground mt-1">
              Yes, we offer design and modeling services for an additional fee.
              Contact us with your requirements for a custom quote.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">
              {`What&apos;s the largest size you can print?`}
            </h3>
            <p className="text-muted-foreground mt-1">
              Our largest printer has a build volume of 300mm x 300mm x 400mm.
              Larger designs can be broken into parts and assembled after
              printing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
