"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";
import { log } from "console";

type AuthFormProps = {
  type: "login" | "signup";
};
export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form>
      <div className="space-y-1">
        <Label htmlFor="email" className="sm:text-lg">
          Email
        </Label>
        <Input
          className="border-zinc-400 sm:text-lg"
          type="email"
          name="email"
          id="email"
          required
          maxLength={100}
        />
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password" className="sm:text-lg">
          Password
        </Label>
        <Input
          className="border-zinc-400 sm:text-lg"
          type="password"
          name="password"
          id="password"
          required
          maxLength={100}
        />
      </div>
      <AuthFormBtn type={type} />
    </form>
  );
}
