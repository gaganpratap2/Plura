import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Rocket, Workflow, Plug, KeyRound, CreditCard, HelpCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const docSections = [
    {
        icon: Rocket,
        title: "Getting Started",
        description: "Create your agency, invite your team, and set up your first sub-account.",
        href: "/documentation/getting-started",
    },
    {
        icon: Workflow,
        title: "CRM & Pipelines",
        description: "Learn how to configure pipelines, stages, and deal automation.",
        href: "/documentation/crm",
    },
    {
        icon: Plug,
        title: "Integrations",
        description: "Connect Stripe, email providers, and other third-party tools.",
        href: "/documentation/integrations",
    },
    {
        icon: KeyRound,
        title: "API Reference",
        description: "Authenticate and interact with your agency data programmatically.",
        href: "/documentation/api",
    },
    {
        icon: CreditCard,
        title: "Billing & Plans",
        description: "Understand plan limits, upgrades, downgrades, and invoices.",
        href: "/documentation/billing",
    },
    {
        icon: HelpCircle,
        title: "FAQs",
        description: "Answers to the most common questions from agency owners.",
        href: "/documentation/faq",
    },
];

const DocumentationPage = () => {
    return (
        <section className="w-full pt-36 pb-20 relative flex flex-col items-center">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            <div className="flex items-center gap-2 text-muted-foreground uppercase text-sm tracking-wide font-medium">
                <BookOpen size={16} />
                Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mt-2">
                Everything you need to build with Plura
            </h1>
            <p className="text-muted-foreground text-center max-w-xl mt-4">
                Guides and references for setting up your agency CRM, automations,
                and integrations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 px-4 max-w-6xl w-full">
                {docSections.map((doc) => {
                    const Icon = doc.icon;
                    return (
                        <Link key={doc.title} href={doc.href}>
                            <Card className="h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                                        <Icon className="text-primary" size={20} />
                                    </div>
                                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                                    <CardDescription>{doc.description}</CardDescription>
                                </CardHeader>
                                <CardContent />
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default DocumentationPage;