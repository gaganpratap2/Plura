import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 via-primary to-primary/70 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />

        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <Image
            src="/assets/plura-logo.svg"
            width={40}
            height={40}
            alt="logo"
            className="brightness-0 invert"
          />
          <span className="text-xl font-bold text-white">Plura.</span>
        </Link>

        <div className="relative z-10 space-y-4 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Run your agency on autopilot.
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Clients, funnels, automations, and billing — all in one place,
            built for agencies that move fast.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-white/70 text-sm">
          <span>✓ Trusted by 2,000+ agencies</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 lg:hidden"
        >
          <Image src="/assets/plura-logo.svg" width={32} height={32} alt="logo" />
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
              elements: {
                rootBox: "w-full mx-auto",
                card: "shadow-xl rounded-2xl border border-border p-6 bg-card",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-border hover:bg-muted rounded-lg transition-colors",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-xs",
                formFieldLabel: "font-medium",
                formFieldInput:
                  "rounded-lg border-border focus:border-primary focus:ring-primary",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium normal-case transition-colors",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewEditButton: "text-primary",
              },
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorBackground: "hsl(var(--card))",
                colorText: "hsl(var(--foreground))",
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
























// import { SignIn } from "@clerk/nextjs";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Sign In",
//   description: "Sign in to your account",
// };

// const Page = () => {
//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
//       <SignIn
//         appearance={{
//           elements: {
//             rootBox: "mx-auto",
//             card: "shadow-lg rounded-xl",
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default Page;
