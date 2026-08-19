"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Layers,
  RotateCw,
  Sparkles,
  Maximize2,
  Minimize2,
  FileCode,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CADModelPreset {
  id: string;
  name: string;
  category: string;
  dimensions: { x: number; y: number; z: number };
  weightGrams: number;
  printTimeMinutes: number;
  layerCount: number;
  geometryType: "camera_mount" | "antenna_bracket" | "arm_skid";
}

const CAD_PRESETS: CADModelPreset[] = [
  {
    id: "gopro-mount",
    name: "GoPro Hero 11/12 25° TPU Mount",
    category: "Action Cam Mounts",
    dimensions: { x: 52.4, y: 44.8, z: 48.0 },
    weightGrams: 28.5,
    printTimeMinutes: 115,
    layerCount: 240,
    geometryType: "camera_mount",
  },
  {
    id: "antenna-bracket",
    name: "Dual Immortal-T + SMA Antenna Bracket",
    category: "Avionics Brackets",
    dimensions: { x: 58.0, y: 19.5, z: 24.2 },
    weightGrams: 14.2,
    printTimeMinutes: 65,
    layerCount: 121,
    geometryType: "antenna_bracket",
  },
  {
    id: "arm-skid",
    name: "5-inch Chamfered Arm Bumper Skid",
    category: "Crash Protection",
    dimensions: { x: 62.0, y: 22.0, z: 14.5 },
    weightGrams: 9.8,
    printTimeMinutes: 42,
    layerCount: 72,
    geometryType: "arm_skid",
  },
];

const MATERIALS = [
  { id: "black-tpu", name: "Stealth Black TPU", color: "#1e293b", wireColor: "#38bdf8" },
  { id: "neon-yellow", name: "Neon Yellow TPU", color: "#eab308", wireColor: "#fef08a" },
  { id: "signal-orange", name: "Signal Orange TPU", color: "#f97316", wireColor: "#fed7aa" },
  { id: "carbon-cf", name: "Carbon Fiber PETG", color: "#334155", wireColor: "#94a3b8" },
];

export function Model3DViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedModel, setSelectedModel] = useState<CADModelPreset>(CAD_PRESETS[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [viewMode, setViewMode] = useState<"solid" | "wireframe" | "layers">("solid");
  const [autoRotate, setAutoRotate] = useState(true);

  // Rotation state
  const rotationRef = useRef({ x: 25, y: 45 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // WebGL / Canvas 3D Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.6;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw Grid Floor
      ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 140;
      const gridStep = 20;

      for (let x = -gridSize; x <= gridSize; x += gridStep) {
        const p1 = project3D(x, 70, -gridSize, rotationRef.current, cx, cy);
        const p2 = project3D(x, 70, gridSize, rotationRef.current, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      for (let z = -gridSize; z <= gridSize; z += gridStep) {
        const p1 = project3D(-gridSize, 70, z, rotationRef.current, cx, cy);
        const p2 = project3D(gridSize, 70, z, rotationRef.current, cx, cy);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Generate 3D CAD Mesh Vertices & Faces based on geometryType
      const { vertices, faces } = generateGeometry(selectedModel.geometryType);

      // Render 3D Sliced Layers Mode
      if (viewMode === "layers") {
        ctx.strokeStyle = selectedMaterial.wireColor;
        ctx.lineWidth = 1.5;
        const layerSpacing = 6;
        for (let y = -45; y <= 45; y += layerSpacing) {
          const p1 = project3D(-50, y, -40, rotationRef.current, cx, cy);
          const p2 = project3D(50, y, -40, rotationRef.current, cx, cy);
          const p3 = project3D(50, y, 40, rotationRef.current, cx, cy);
          const p4 = project3D(-50, y, 40, rotationRef.current, cx, cy);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.stroke();
        }
      } else {
        // Render 3D Faces with Painter's Algorithm Depth Sort
        const transformedFaces = faces.map((face) => {
          const pts = face.map((vIdx) => {
            const v = vertices[vIdx];
            return project3D(v[0], v[1], v[2], rotationRef.current, cx, cy);
          });
          const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
          return { pts, avgZ };
        });

        transformedFaces.sort((a, b) => b.avgZ - a.avgZ);

        for (const { pts } of transformedFaces) {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.closePath();

          if (viewMode === "solid") {
            ctx.fillStyle = selectedMaterial.color;
            ctx.fill();
            ctx.strokeStyle = selectedMaterial.wireColor;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else {
            // Wireframe
            ctx.strokeStyle = selectedMaterial.wireColor;
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedModel, selectedMaterial, viewMode, autoRotate]);

  // Mouse Orbit Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    rotationRef.current.y += deltaX * 0.7;
    rotationRef.current.x = Math.max(-60, Math.min(60, rotationRef.current.x - deltaY * 0.7));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card/60 shadow-xl backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b bg-muted/40 px-5 py-3.5 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileCode className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{selectedModel.name}</h3>
            <span className="text-[11px] text-muted-foreground">
              Interactive 3D CAD Mesh & Slicing Simulation
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-lg border bg-background/80 p-1">
          <button
            onClick={() => setViewMode("solid")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === "solid"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Solid Mesh
          </button>
          <button
            onClick={() => setViewMode("wireframe")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === "wireframe"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setViewMode("layers")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === "layers"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Layer Slices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* 3D Canvas Area */}
        <div
          className="lg:col-span-8 relative bg-linear-to-b from-background to-muted/30 flex items-center justify-center min-h-[380px] cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={380}
            className="w-full h-full max-h-[380px]"
          />

          {/* Canvas Floating Overlay Controls */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <span className="text-[11px] font-mono font-medium text-muted-foreground bg-background/80 backdrop-blur-md px-2 py-0.5 rounded border shadow-xs">
              X: {selectedModel.dimensions.x} mm • Y: {selectedModel.dimensions.y} mm • Z: {selectedModel.dimensions.z} mm
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="h-7 gap-1.5 text-xs bg-background/80 backdrop-blur-md"
            >
              <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} />
              <span>{autoRotate ? "Auto-Rotating" : "Paused"}</span>
            </Button>
          </div>
        </div>

        {/* CAD Properties & Material Controls */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l bg-card p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* CAD Model Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Select CAD Prototype Preset
              </label>
              <div className="space-y-1.5">
                {CAD_PRESETS.map((preset) => {
                  const isSelected = selectedModel.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedModel(preset)}
                      className={`w-full flex items-center justify-between rounded-lg border p-2.5 text-left text-xs transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary font-semibold ring-1 ring-primary/30"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{preset.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material & Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Filament & TPU Colorway
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MATERIALS.map((mat) => {
                  const isSelected = selectedMaterial.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                        isSelected
                          ? "border-primary font-semibold ring-1 ring-primary/30 bg-primary/5"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border shadow-xs shrink-0"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="truncate text-[11px]">{mat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slicing Estimates Summary Card */}
            <div className="rounded-lg border bg-muted/20 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Calculated Volume:</span>
                <strong className="text-foreground">
                  {Math.round(selectedModel.dimensions.x * selectedModel.dimensions.y * selectedModel.dimensions.z / 1000)} cm³
                </strong>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Estimated Material Weight:</span>
                <strong className="text-foreground">{selectedModel.weightGrams} grams</strong>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Print Duration (0.2mm):</span>
                <strong className="text-foreground">~{selectedModel.printTimeMinutes} minutes</strong>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>G-Code Layers:</span>
                <strong className="text-foreground">{selectedModel.layerCount} layers</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3D Projection Math Helper ────────────────────────────────────────────────
function project3D(
  x: number,
  y: number,
  z: number,
  rot: { x: number; y: number },
  cx: number,
  cy: number,
) {
  const radX = (rot.x * Math.PI) / 180;
  const radY = (rot.y * Math.PI) / 180;

  // Rotate around Y axis
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  // Perspective projection
  const fov = 400;
  const scale = fov / (fov + z2 + 180);

  return {
    x: cx + x1 * scale,
    y: cy + y2 * scale,
    z: z2,
  };
}

// ─── Procedural CAD Mesh Geometry Generator ──────────────────────────────────
function generateGeometry(type: "camera_mount" | "antenna_bracket" | "arm_skid") {
  if (type === "camera_mount") {
    // Slanted 25-degree camera cradle wedge
    const vertices = [
      [-40, 35, -35], [40, 35, -35], [40, 35, 35], [-40, 35, 35],
      [-30, -35, -35], [30, -35, -35], [35, -15, 35], [-35, -15, 35],
      [-25, -25, 0], [25, -25, 0], [25, 10, 20], [-25, 10, 20],
    ];
    const faces = [
      [0, 1, 2, 3], // Base
      [4, 5, 6, 7], // Top slanted
      [0, 1, 5, 4], // Back
      [2, 3, 7, 6], // Front
      [0, 3, 7, 4], // Left
      [1, 2, 6, 5], // Right
      [8, 9, 10, 11], // Camera cutout
    ];
    return { vertices, faces };
  } else if (type === "antenna_bracket") {
    // T-bracket mounting structure
    const vertices = [
      [-55, 15, -15], [55, 15, -15], [55, 15, 15], [-55, 15, 15],
      [-50, -15, -10], [50, -15, -10], [50, -15, 10], [-50, -15, 10],
      [-15, -45, -15], [15, -45, -15], [15, -45, 15], [-15, -45, 15],
    ];
    const faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [8, 9, 10, 11],
      [4, 5, 9, 8],
    ];
    return { vertices, faces };
  } else {
    // Arm bumper skid
    const vertices = [
      [-60, 12, -20], [60, 12, -20], [60, 12, 20], [-60, 12, 20],
      [-50, -12, -15], [50, -12, -15], [45, -12, 15], [-45, -12, 15],
      [-30, -25, 0], [30, -25, 0],
    ];
    const faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [0, 3, 7, 4],
      [1, 2, 6, 5],
    ];
    return { vertices, faces };
  }
}
