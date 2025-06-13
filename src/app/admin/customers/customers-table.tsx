"use client";

import React, { useState } from "react";
import { Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface Customer {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

interface CustomersTableProps {
  initialCustomers: Customer[];
  error?: string;
}

export default function CustomersTable({
  initialCustomers,
  error,
}: CustomersTableProps) {
  const [customers] = useState<Customer[]>(initialCustomers || []);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm)),
  );

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/10">
        <div className="flex">
          <div className="text-sm font-medium text-red-800 dark:text-red-200">
            Error loading customers: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div className="relative w-64">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2" />
                        {customer.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2" />
                        {customer.phone || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
