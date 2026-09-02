import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constant";
import clsx from "clsx";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

const PricingPage = () => {
    return (
        <section className="w-full pt-36 pb-20 relative flex flex-col items-center">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            <p className="text-muted-foreground uppercase text-sm tracking-wide font-medium">
                Pricing
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-center mt-2">
                Simple, transparent pricing
            </h1>
            <p className="text-muted-foreground text-center max-w-xl mt-4">
                Our straightforward pricing plans are tailored to meet your needs.
                If you&apos;re not ready to commit, you can get started for free.
            </p>

            <div className="flex justify-center gap-6 flex-wrap mt-14 px-4 max-w-6xl w-full">
                {pricingCards.map((card) => {
                    const isFeatured = card.title === "Unlimited Saas";
                    return (
                        <Card
                            key={card.title}
                            className={clsx(
                                "w-[300px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg relative",
                                { "border-2 border-primary shadow-md": isFeatured }
                            )}
                        >
                            {isFeatured && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                    Most Popular
                                </span>
                            )}
                            <CardHeader>
                                <CardTitle
                                    className={clsx({
                                        "text-muted-foreground": !isFeatured,
                                    })}
                                >
                                    {card.title}
                                </CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-3xl font-bold">{card.price}</span>
                                <span className="text-muted-foreground">/m</span>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4">
                                <ul className="space-y-2 w-full">
                                    {card.features.map((feature) => (
                                        <li key={feature} className="flex gap-2 items-center">
                                            <Check className="text-muted-foreground shrink-0" size={18} />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/agency?plan=${card.priceId}`}
                                    className={clsx(
                                        "w-full text-center bg-primary p-2 rounded-md font-medium transition-colors hover:opacity-90",
                                        { "!bg-muted-foreground": !isFeatured }
                                    )}
                                >
                                    Get Started
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};

export default PricingPage;
