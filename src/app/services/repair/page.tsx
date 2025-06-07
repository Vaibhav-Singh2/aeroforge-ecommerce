"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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

  // This would be connected to a real submission function
  const handleSubmitRepairRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission functionality
    console.log({
      deviceType,
      deviceModel,
      deviceBrand,
      issueDescription,
      contactPhone,
      images,
    });

    // Redirect or show success message
    // router.push("/account/repair-orders");
    alert("Repair request submitted! We'll contact you with a quote soon.");
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
              <div className="space-y-2">
                <label htmlFor="deviceType" className="font-medium">
                  Device Type*
                </label>
                <Select onValueChange={setDeviceType} required>
                  <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <label className="font-medium">Upload Images (Optional)</label>
              <div className="border-input rounded-md border p-4">
                <Input
                  type="file"
                  className="cursor-pointer"
                  accept="image/*"
                  multiple
                />
                <p className="text-muted-foreground mt-2 text-sm">
                  Images showing the damage or issues will help us provide a
                  more accurate quote.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit Repair Request
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
              You'll receive email and SMS notifications at each stage of the
              repair process, including when your device is ready for pickup or
              shipment.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">
              What if my device cannot be repaired?
            </h3>
            <p className="text-muted-foreground mt-1">
              If we determine your device cannot be repaired, we'll notify you
              and only charge a diagnostic fee. We can also provide
              recommendations for replacement options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
