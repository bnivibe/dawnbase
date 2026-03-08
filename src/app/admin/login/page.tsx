"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground">Enter password to continue</p>
        </div>

        <form action={action} className="space-y-3">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
          />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Verifying..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
