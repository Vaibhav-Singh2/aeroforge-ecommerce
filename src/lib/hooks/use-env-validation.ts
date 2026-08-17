"use client";

import { useEffect, useState } from "react";

interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
}

/**
 * Hook to validate required environment variables in client components
 * @param requiredVars Array of required environment variable names
 * @returns Validation result
 */
export function useEnvValidation(requiredVars: string[]): EnvValidationResult {
  const [validation, setValidation] = useState<EnvValidationResult>({
    isValid: true,
    missingVars: [],
  });
  useEffect(() => {
    const missing: string[] = [];

    requiredVars.forEach((varName) => {
      // Check for both with and without NEXT_PUBLIC_ prefix
      if (!process.env[`NEXT_PUBLIC_${varName}`] && !process.env[varName]) {
        missing.push(varName);
      }
    });

    setValidation({
      isValid: missing.length === 0,
      missingVars: missing,
    });
  }, [requiredVars]);

  return validation;
}

/**
 * Hook to specifically validate Vercel Blob environment variables
 * @returns Validation result
 */
export function useVercelBlobValidation(): EnvValidationResult {
  const [validation, setValidation] = useState<EnvValidationResult>({
    isValid: true,
    missingVars: [],
  });

  useEffect(() => {
    // Check for both possible environment variable names
    const hasToken =
      typeof process.env.NEXT_PUBLIC_VERCEL_BLOB_TOKEN !== "undefined" ||
      typeof process.env.VERCEL_BLOB_TOKEN !== "undefined";

    setValidation({
      isValid: hasToken,
      missingVars: hasToken ? [] : ["VERCEL_BLOB_TOKEN"],
    });
  }, []);

  return validation;
}
