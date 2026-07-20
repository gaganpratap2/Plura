import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { crmFeatures } from "@/lib/constant";
import Link from "next/link";
import React from "react";

const FeaturesPage = () => {
    return (
        <section className="w-full pt-36 pb-20 relative flex flex-col items-center">
            {/* grid */}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            <p className="text-muted-foreground uppercase text-sm tracking-wide font-medium">
                Everything you need
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-center mt-2 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
                A CRM built for agencies
            </h1>
            <p className="text-muted-foreground text-center max-w-xl mt-4">
                Manage contacts, pipelines, campaigns, and clients — all from one
                place. No more juggling five different tools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 px-4 max-w-6xl w-full">
                {crmFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <Card
                            key={feature.title}
                            className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <CardHeader>
                                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                                    <Icon className="text-primary" size={20} />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent />
                        </Card>
                    );
                })}
            </div>

            <Link
                href="/pricing"
                className="mt-14 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
                See pricing plans
            </Link>
        </section>
    );
};

export default FeaturesPage;