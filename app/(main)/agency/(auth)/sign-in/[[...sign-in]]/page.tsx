import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes"; // remove if you don't have next-themes
import React from "react";

const SignInPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 via-primary to-primary/70 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl motion-reduce:hidden" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl motion-reduce:hidden" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl motion-reduce:hidden" />

        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
          <Image
            src="/assets/plura-logo.svg"
            width={40}
            height={40}
            alt="Plura home"
            className="brightness-0 invert"
          />
          <span className="text-xl font-bold text-white">Plura.</span>
        </Link>

        <div className="relative z-10 space-y-4 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Run your agency on autopilot.
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Clients, funnels, automations, and billing â€” all in one place,
            built for agencies that move fast.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-white/70 text-sm">
          <span>âœ“ Trusted by 2,000+ agencies</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 lg:hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Image src="/assets/plura-logo.svg" width={32} height={32} alt="Plura home" />
          <span className="text-lg font-bold">Plura.</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-1">
              Sign in to your agency dashboard
            </p>
          </div>

          <SignIn
            appearance={{
              baseTheme: isDark ? dark : undefined,
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
                shimmer: true,
              },
              elements: {
                rootBox: "w-full mx-auto",
                card: "shadow-xl rounded-2xl border border-border p-6 bg-card",
                headerTitle: "hidden",
                headerSubtitle: "hidden",

                socialButtonsBlockButton:
                  "border border-border hover:bg-muted rounded-lg transition-colors motion-reduce:transition-none min-h-[44px]",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-xs",

                formFieldLabel: "font-medium text-foreground mb-1.5",
                formFieldInput:
                  "rounded-lg border-border bg-background text-foreground min-h-[44px] " +
                  "focus:border-primary focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 " +
                  "transition-colors motion-reduce:transition-none " +
                  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30",
                formFieldInputShowPasswordButton:
                  "text-muted-foreground hover:text-foreground transition-colors motion-reduce:transition-none " +
                  "min-w-[36px] min-h-[36px] rounded-md " +
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                formFieldErrorText: "text-destructive text-sm mt-1.5",
                formFieldHintText: "text-muted-foreground text-xs mt-1",
                formFieldAction:
                  "text-sm text-primary hover:text-primary/80 font-medium",

                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 active:bg-primary/95 rounded-lg text-sm font-medium " +
                  "normal-case transition-colors motion-reduce:transition-none min-h-[44px] " +
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 " +
                  "disabled:opacity-60 disabled:cursor-not-allowed",

                footerActionLink:
                  "text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline",
                identityPreviewEditButton: "text-primary",

                alertText: "text-destructive text-sm",
                identityPreviewText: "text-foreground",
              },
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorBackground: "hsl(var(--card))",
                colorText: "hsl(var(--foreground))",
                colorDanger: "hsl(var(--destructive))",
                colorTextSecondary: "hsl(var(--muted-foreground))",
                borderRadius: "0.5rem",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
