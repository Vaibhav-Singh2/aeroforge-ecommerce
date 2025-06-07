"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const handleSubmitPrintRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission functionality
    console.log({
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
      fileUrls,
      images,
    });

    // Redirect or show success message
    alert("3D Print request submitted! We'll contact you with a quote soon.");
  };

  const handlePostProcessingChange = (option: string) => {
    setPostProcessingOptions((current) => {
      if (current.includes(option)) {
        return current.filter((item) => item !== option);
      } else {
        return [...current, option];
      }
    });
  };

  return (
    <div className="container mx-auto px-5 py-10">
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
                  Our team will review your design and provide a detailed quote
                  within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                3
              </div>
              <div>
                <h3 className="font-medium">Approve and Pay</h3>
                <p className="text-muted-foreground">
                  Review and approve the quote, then make payment to initiate
                  printing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                4
              </div>
              <div>
                <h3 className="font-medium">Production and Delivery</h3>
                <p className="text-muted-foreground">
                  {`We'll print and finish your item according to specifications,
                  then ship or prepare it for pickup.`}
                </p>
              </div>
            </div>
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
                placeholder="Name your print project"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="material" className="font-medium">
                  Material*
                </label>
                <Select onValueChange={setMaterial} required>
                  <SelectTrigger>
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
                  Color (if applicable)
                </label>
                <Input
                  id="color"
                  placeholder="e.g. Red, Blue, Black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="quantity" className="font-medium">
                  Quantity*
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="infill" className="font-medium">
                  Infill % (10-100)
                </label>
                <Input
                  id="infill"
                  type="number"
                  min="10"
                  max="100"
                  value={infill}
                  onChange={(e) => setInfill(parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="layerHeight" className="font-medium">
                  Layer Height (mm)
                </label>
                <Select onValueChange={(v) => setLayerHeight(parseFloat(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Layer height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1mm (Fine)</SelectItem>
                    <SelectItem value="0.2">0.2mm (Standard)</SelectItem>
                    <SelectItem value="0.3">0.3mm (Draft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="printQuality" className="font-medium">
                Print Quality
              </label>
              <Select onValueChange={setPrintQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    Draft - Faster, visible layers
                  </SelectItem>
                  <SelectItem value="normal">
                    Normal - Balanced quality and speed
                  </SelectItem>
                  <SelectItem value="high">
                    High - Slower, finer details
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Model Files*</label>
              <div className="border-input rounded-md border p-4">
                <Input
                  type="file"
                  className="cursor-pointer"
                  accept=".stl,.obj"
                  multiple
                />
                <p className="text-muted-foreground mt-2 text-sm">
                  Upload your 3D model files (.STL or .OBJ format)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Preview Images (Optional)</label>
              <div className="border-input rounded-md border p-4">
                <Input
                  type="file"
                  className="cursor-pointer"
                  accept="image/*"
                  multiple
                />
                <p className="text-muted-foreground mt-2 text-sm">
                  {`Images of your model or example of what you're trying to
                  achieve`}
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-md border p-4">
              <h3 className="font-medium">Additional Options</h3>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="isRush"
                  checked={isRush}
                  onCheckedChange={() => setIsRush(!isRush)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="isRush"
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Rush Order (+50% fee)
                  </label>
                  <p className="text-muted-foreground text-sm">
                    Prioritize your order for faster printing and processing
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="needsSupports"
                  checked={needsSupports}
                  onCheckedChange={() => setNeedsSupports(!needsSupports)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="needsSupports"
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Add Support Structures
                  </label>
                  <p className="text-muted-foreground text-sm">
                    Recommended for complex designs with overhangs
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Post-Processing Options
                </label>
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
            </div>

            <Button type="submit" className="w-full">
              Submit 3D Print Request
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
              {`We accept STL and OBJ files. If you have a different format,
              please contact us and we'll see if we can work with it.`}
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
              {`What's the largest size you can print?`}
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
