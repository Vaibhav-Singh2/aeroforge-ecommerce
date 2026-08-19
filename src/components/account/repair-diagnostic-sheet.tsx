"use client";

import {
  Activity,
  CheckCircle2,
  Cpu,
  Flame,
  Gauge,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RepairDiagnosticSheetProps {
  repairNumber: string;
  deviceModel: string;
}

export function RepairDiagnosticSheet({
  repairNumber,
  deviceModel,
}: RepairDiagnosticSheetProps) {
  const motorData = [
    { motor: "Motor 1 (Front Left)", rpm: "31,240 RPM", temp: "42°C", resistance: "0.048 Ω", status: "HEALTHY" },
    { motor: "Motor 2 (Front Right)", rpm: "31,180 RPM", temp: "44°C", resistance: "0.049 Ω", status: "HEALTHY" },
    { motor: "Motor 3 (Rear Right)", rpm: "31,290 RPM", temp: "43°C", resistance: "0.048 Ω", status: "HEALTHY" },
    { motor: "Motor 4 (Rear Left)", rpm: "31,210 RPM", temp: "41°C", resistance: "0.047 Ω", status: "HEALTHY" },
  ];

  return (
    <div className="rounded-2xl border bg-card/60 shadow-xl backdrop-blur-md overflow-hidden space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b pb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              AeroForge Digital Diagnostic Bench Sheet
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Station #04 • Work Order: {repairNumber} • {deviceModel}
            </span>
          </div>
        </div>

        <Badge variant="outline" className="text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20 text-[11px] gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Diagnostic Passed (ISO-9001)</span>
        </Badge>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. ESC Smoke & Current Bench */}
        <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              ESC Power & Ripple
            </span>
            <span className="text-[10px] font-mono text-green-600 font-bold">PASS</span>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Idle Voltage Ripple:</span>
              <strong className="text-foreground font-mono">0.18 mV (Clean)</strong>
            </div>
            <div className="flex justify-between">
              <span>MOSFET Gate Resistance:</span>
              <strong className="text-foreground font-mono">9.8 kΩ (Nominal)</strong>
            </div>
            <div className="flex justify-between">
              <span>Burst Current Limit:</span>
              <strong className="text-foreground font-mono">60A Verified</strong>
            </div>
          </div>
        </div>

        {/* 2. Gyroscope FFT Noise Spectrum */}
        <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Dual ICM Gyro Noise
            </span>
            <span className="text-[10px] font-mono text-green-600 font-bold">NOISELESS</span>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Vibration Frequency Peak:</span>
              <strong className="text-foreground font-mono">248 Hz (Filtered)</strong>
            </div>
            <div className="flex justify-between">
              <span>RPM Filter Notch Suppression:</span>
              <strong className="text-foreground font-mono">-42 dB (High)</strong>
            </div>
            <div className="flex justify-between">
              <span>Blackbox Looptime:</span>
              <strong className="text-foreground font-mono">8kHz / 8kHz DShot</strong>
            </div>
          </div>
        </div>

        {/* 3. RF Receiver Link Quality */}
        <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              ELRS / CRSF RF Link
            </span>
            <span className="text-[10px] font-mono text-green-600 font-bold">100% LQ</span>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Packet Rate:</span>
              <strong className="text-foreground font-mono">500 Hz True</strong>
            </div>
            <div className="flex justify-between">
              <span>Sensitivity RSSI (dBm):</span>
              <strong className="text-foreground font-mono">-38 dBm (Strong)</strong>
            </div>
            <div className="flex justify-between">
              <span>Antenna VSWR:</span>
              <strong className="text-foreground font-mono">1.12 : 1 (Tuned)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Motor Dynamometer Table */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Motor Dynamometer & Thermal Balancing Telemetry
        </span>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/60 text-muted-foreground text-[10px] font-semibold uppercase border-b">
              <tr>
                <th className="p-2.5">Brushless Motor</th>
                <th className="p-2.5 text-center">Peak RPM</th>
                <th className="p-2.5 text-center">Coil Resistance</th>
                <th className="p-2.5 text-center">Operating Temp</th>
                <th className="p-2.5 text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {motorData.map((m, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="p-2.5 font-medium text-foreground">{m.motor}</td>
                  <td className="p-2.5 text-center font-mono">{m.rpm}</td>
                  <td className="p-2.5 text-center font-mono">{m.resistance}</td>
                  <td className="p-2.5 text-center font-mono">{m.temp}</td>
                  <td className="p-2.5 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
