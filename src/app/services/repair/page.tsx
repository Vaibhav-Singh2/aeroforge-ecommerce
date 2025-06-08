"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RepairServicesPage() {
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [repairNumber, setRepairNumber] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSubmitRepairRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check required fields
    if (!deviceType || !deviceModel || !issueDescription || !contactPhone) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit repair request to the API
      const response = await fetch("/api/repair-orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceType,
          deviceModel,
          deviceBrand,
          issueDescription,
          contactPhone,
          images, // These are already Blob URLs stored in Vercel Blob storage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit repair request");
      }

      // Set success state and repair number
      setSuccess(true);
      setRepairNumber(data.repairOrder.repairNumber);

      // Reset the form
      setDeviceType("");
      setDeviceModel("");
      setDeviceBrand("");
      setIssueDescription("");
      setContactPhone("");
      setImages([]);

      // After 3 seconds, redirect to the repair orders page
      setTimeout(() => {
        router.push("/account/repair-orders");
      }, 3000);
    } catch (error) {
      console.error("Error submitting repair request:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Drone & RC Repair Services</h1>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Expert Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our technicians will thoroughly diagnose your drone or RC vehicle
              to identify all issues.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We use genuine parts and proven techniques to ensure your device
              works like new again.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fast Turnaround</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Most repairs are completed within 3-5 business days after quote
              approval.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            How Our Repair Process Works
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                1
              </div>
              <div>
                <h3 className="font-medium">Submit Repair Request</h3>
                <p className="text-muted-foreground">
                  {`Fill out our repair form with details about your device and
                  the issues you're experiencing.`}
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
                  Our technicians will assess your repair and provide a detailed
                  quote within 1-2 business days.
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
                  Review and approve the quote, then make a deposit payment to
                  start repairs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                4
              </div>
              <div>
                <h3 className="font-medium">Repair Completion</h3>
                <p className="text-muted-foreground">
                  {`Once repairs are complete, we'll notify you for pickup or
                  arrange shipping.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            Request a Repair Quote
          </h2>

          <form onSubmit={handleSubmitRepairRequest} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {" "}
              <div className="space-y-2">
                <label htmlFor="deviceType" className="font-medium">
                  Device Type*
                </label>
                <Select
                  value={deviceType}
                  onValueChange={(value) => setDeviceType(value)}
                  required
                >
                  <SelectTrigger id="deviceType">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drone">Drone</SelectItem>
                    <SelectItem value="rc-plane">RC Plane</SelectItem>
                    <SelectItem value="rc-car">RC Car/Truck</SelectItem>
                    <SelectItem value="rc-helicopter">RC Helicopter</SelectItem>
                    <SelectItem value="other">Other RC Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="deviceBrand" className="font-medium">
                  Brand (Optional)
                </label>
                <Input
                  id="deviceBrand"
                  placeholder="e.g. DJI, Traxxas, HobbyZone"
                  value={deviceBrand}
                  onChange={(e) => setDeviceBrand(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="deviceModel" className="font-medium">
                Model/Name*
              </label>
              <Input
                id="deviceModel"
                placeholder="Device model or name"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="issueDescription" className="font-medium">
                Describe the Issue*
              </label>
              <Textarea
                id="issueDescription"
                placeholder="Please describe the problem in detail..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="font-medium">
                Contact Phone*
              </label>
              <Input
                id="contactPhone"
                placeholder="Best number to reach you"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>{" "}
            <div className="space-y-2">
              <label className="font-medium">Upload Images (Optional)</label>
              <ImageUpload
                value={images}
                onChange={setImages}
                maxFiles={5}
                folder="repair-orders/images"
              />
              <p className="text-muted-foreground mt-2 text-sm">
                Images showing the damage or issues will help us provide a more
                accurate quote.
              </p>
            </div>{" "}
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
            {success && repairNumber && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Repair Request Submitted!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your repair request number is{" "}
                        <span className="font-bold">{repairNumber}</span>.{" "}
                        {`We'll
                        contact you with a quote soon. Redirecting to your`}
                        repair orders...
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
              {isSubmitting ? "Submitting..." : "Submit Repair Request"}
            </Button>
            <p className="text-muted-foreground text-sm">
              By submitting this form, you agree to our repair service terms and
              conditions.
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
            <h3 className="font-medium">How long do repairs typically take?</h3>
            <p className="text-muted-foreground mt-1">
              Most repairs are completed within 3-5 business days after quote
              approval, depending on parts availability and complexity.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Do you provide warranty on repairs?</h3>
            <p className="text-muted-foreground mt-1">
              Yes, all our repairs come with a 30-day warranty on the parts
              replaced and labor performed.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">
              How will I know when my repair is completed?
            </h3>
            <p className="text-muted-foreground mt-1">
              {`You'll receive email and SMS notifications at each stage of the
              repair process, including when your device is ready for pickup or
              shipment.`}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">
              What if my device cannot be repaired?
            </h3>
            <p className="text-muted-foreground mt-1">
              {`If we determine your device cannot be repaired, we'll notify you
              and only charge a diagnostic fee. We can also provide
              recommendations for replacement options.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
