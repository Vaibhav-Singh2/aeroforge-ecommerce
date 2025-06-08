"use client";

import React, { useState, useEffect } from "react";
import { Package, ShoppingBag, Users, AlertCircle } from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  color: string;
}

export default function DashboardCards() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Total Products",
      value: "Loading...",
      icon: Package,
      description: "Total products in inventory",
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: "Loading...",
      icon: ShoppingBag,
      description: "Orders this month",
      color: "bg-green-500",
    },
    {
      title: "Customers",
      value: "Loading...",
      icon: Users,
      description: "Registered customers",
      color: "bg-purple-500",
    },
    {
      title: "Low Stock",
      value: "Loading...",
      icon: AlertCircle,
      description: "Products with low stock",
      color: "bg-orange-500",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you would fetch actual data from an API
        // For now, simulating with hardcoded data and timeout
        setTimeout(() => {
          setStats([
            {
              title: "Total Products",
              value: 256,
              icon: Package,
              description: "Total products in inventory",
              color: "bg-blue-500",
            },
            {
              title: "Total Orders",
              value: 45,
              icon: ShoppingBag,
              description: "Orders this month",
              color: "bg-green-500",
            },
            {
              title: "Customers",
              value: 189,
              icon: Users,
              description: "Registered customers",
              color: "bg-purple-500",
            },
            {
              title: "Low Stock",
              value: 12,
              icon: AlertCircle,
              description: "Products with low stock",
              color: "bg-orange-500",
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-background overflow-hidden rounded-lg border shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-muted-foreground truncate text-sm font-medium">
                    {stat.title}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold">
                    {isLoading ? (
                      <div className="bg-muted h-8 w-16 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 text-muted-foreground px-6 py-2 text-xs">
              {stat.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
