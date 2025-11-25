import { RequestHandler } from "express";
import { z } from "zod";
import { SignUpRequest, LoginRequest, AuthResponse, User } from "@shared/api";
import crypto from "crypto";

// Mock user storage (in production, use Supabase)
const users = new Map<string, any>();
const tokens = new Map<string, User>();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, "salt", 1000, 64, "sha512")
    .toString("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hash === hashPassword(password);
}

const SignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ngo", "funder"]),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const validatedData = SignUpSchema.parse(req.body);

    // Check if user already exists
    if (users.has(validatedData.email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user
    const userId = crypto.randomUUID();
    const user: User = {
      id: userId,
      email: validatedData.email,
      name: validatedData.name,
      role: validatedData.role,
      profile_complete: false,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const userRecord = {
      ...user,
      password_hash: hashPassword(validatedData.password),
    };

    users.set(validatedData.email, userRecord);

    // Generate token
    const token = generateToken();
    tokens.set(token, user);

    const response: AuthResponse = {
      user,
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const validatedData = LoginSchema.parse(req.body);

    // Find user
    const userRecord = users.get(validatedData.email);
    if (!userRecord) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    if (!verifyPassword(validatedData.password, userRecord.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken();
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      profile_complete: userRecord.profile_complete,
      verified: userRecord.verified,
      created_at: userRecord.created_at,
      updated_at: userRecord.updated_at,
    };

    tokens.set(token, user);

    const response: AuthResponse = {
      user,
      token,
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const handleGetCurrentUser: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = tokens.get(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};
