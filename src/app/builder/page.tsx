import { Metadata } from "next";
import { DroneBuilderStudio } from "@/components/builder/drone-builder-studio";

export const metadata: Metadata = {
  title: "AeroBuild™ FPV Drone Customizer & Physics Studio – AeroForge Labs",
  description:
    "Design and configure custom high-performance FPV racing and freestyle drones with real-time thrust-to-weight and flight time physics.",
};

export default function BuilderPage() {
  return <DroneBuilderStudio />;
}
