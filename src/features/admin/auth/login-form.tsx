"use client";

import { useActionState } from "react";
import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginAction, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <Card className="w-full max-w-sm rounded-3xl shadow-luxury-lg border-border/60">
      <CardHeader className="flex flex-col items-center gap-2 pb-2">
        <div className="bg-luxury-gradient flex size-14 items-center justify-center rounded-2xl shadow-luxury">
          <Gem className="size-7 text-white" />
        </div>
        <h1 className="text-xl font-semibold">AI Jewellery Admin</h1>
        <p className="text-muted-foreground text-sm">Sign in to manage your store</p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state.error && <p className="text-destructive text-sm">{state.error}</p>}
          <Button type="submit" disabled={pending} className="bg-luxury-gradient mt-2 rounded-xl">
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
