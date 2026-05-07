"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// 🔐 Password Strength Logic
function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
  if (score === 3 || score === 4)
    return { label: "Medium", color: "bg-yellow-500", width: "66%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

export default function SignupForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [debouncedPassword, setDebouncedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ⏱️ Debounce password input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPassword(password);
    }, 400);

    return () => clearTimeout(timer);
  }, [password]);

  const strength = getPasswordStrength(debouncedPassword);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    // Match check
    if (password !== confirm) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Strong validation
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongRegex.test(password)) {
      toast.error("Weak password", {
        description:
          "Must be 8+ chars with uppercase, lowercase, number & symbol",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);

      if (result?.error) {
        toast.error("Signup Failed", { description: result.error });
      } else if (result?.redirect) {
        router.push(result.redirect);
      }
    } catch {
      toast.error("Signup Failed", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create an account</h2>
        <p className="text-sm text-slate-500">Start your journey today</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label>Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input name="fullName" required className="pl-10" />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input name="email" type="email" required className="pl-10" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <Label>Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input name="phone" required className="pl-10" />
          </div>
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="pl-10 pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁 Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="mt-2">
              <div className="h-2 w-full bg-slate-200 rounded">
                <div
                  className={`h-2 rounded ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs mt-1 text-slate-500">
                Strength: {strength.label}
              </p>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-1">
            Must be 8+ chars, include uppercase, number & symbol
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <Label>Confirm Password</Label>
          <Input name="confirmPassword" type="password" required />
        </div>

        {/* Submit */}
        <Button className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <>
              Create Account <ArrowRight className="ml-2" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-600 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
