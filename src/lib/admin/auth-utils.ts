import { SignJWT, jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

// Secret key for JWT token
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-secret-key-change-in-production",
);

// Token expiration (24 hours)
const TOKEN_EXPIRY = "24h";

// Type for admin authentication
export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Type guard for AdminJwtPayload
function isAdminJwtPayload(payload: unknown): payload is AdminJwtPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    typeof (payload as AdminJwtPayload).id === "string" &&
    "email" in payload &&
    typeof (payload as AdminJwtPayload).email === "string" &&
    "name" in payload &&
    typeof (payload as AdminJwtPayload).name === "string" &&
    "role" in payload &&
    typeof (payload as AdminJwtPayload).role === "string"
  );
}

/**
 * Create a JWT token for admin
 */
export async function createAdminToken(
  payload: AdminJwtPayload,
): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify admin token
 */
export async function verifyToken(
  token: string,
): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!isAdminJwtPayload(payload)) {
      console.error("Invalid token payload structure");
      return null;
    }
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get admin from token
 */
export async function getAdminFromToken(): Promise<AdminJwtPayload | null> {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Authenticate admin from request object
 */
export async function authenticateAdminRequest(
  request: NextRequest,
): Promise<AdminJwtPayload | null> {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return null;

    return await verifyToken(token);
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Authenticate admin with email and password
 */
export async function authenticateAdmin(email: string, password: string) {
  try {
    // Find the admin by email
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return { success: false, message: "Admin not found" };
    } // Compare passwords using bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return { success: false, message: "Invalid password" };
    }

    // Create token
    const token = await createAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, message: "Authentication failed" };
  }
}

/**
 * Create a default admin if none exists
 */
export async function setupDefaultAdmin() {
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    // Create a default admin with hashed password
    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    await prisma.admin.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin",
        role: "SUPER_ADMIN",
      },
    });
    console.log("Default admin created");
  }
}
