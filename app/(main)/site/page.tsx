import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constant";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
    return (
        <>
            <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col overflow-hidden">
                {/* grid */}
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

                <p className="text-center text-muted-foreground tracking-wide uppercase text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-700">
                    Run your agency, in one place
                </p>
                <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-9xl font-bold text-center md:text-[300px] leading-none">
                        Plura
                    </h1>
                </div>
                <div className="flex justify-center items-center relative md:mt-[-70px]">
                    <Image
                        src="/assets/preview.png"
                        alt="Plura dashboard preview showing agency management interface"
                        width={1200}
                        height={1200}
                        priority
                        className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted shadow-2xl"
                    />
                    <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10" />
                </div>
            </section>

            <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px] px-4">
                <h2 className="text-4xl font-semibold text-center">
                    Choose what fits you right
                </h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Our straightforward pricing plans are tailored to meet your needs.
                    If you&apos;re not ready to commit, you can get started for free.
                </p>

                <div className="flex justify-center gap-6 flex-wrap mt-6 pb-20">
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
        </>
    );
};

export default Page;






























// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { pricingCards } from "@/lib/constant";
// import clsx from "clsx";
// import { Check } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// const Page = () => {
//     return (
//         <>
//             <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
//                 {/* grid */}
//                 <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

//                 <p className="text-center">Run your agency, in one place</p>
//                 <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
//                     <h1 className="text-9xl font-bold text-center md:text-[300px]">Plura</h1>
//                 </div>
//                 <div className="flex justify-center items-center relative md:mt-[-70px]">
//                     <Image src={"/assets/preview.png"} alt="banner-image" width={1200} height={1200} className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted" />
//                     <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
//                 </div>
//             </section>
//             <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
//                 <h2 className="text-4xl text-center"> Choose what fits you right</h2>
//                 <p className="text-muted-foreground text-center">
//                     Our straightforward pricing plans are tailored to meet your needs. If
//                     {" you're"} not <br />
//                     ready to commit you can get started for free.
//                 </p>
//                 <div className="flex justify-center gap-2 flex-wrap mt-6">
//                     {pricingCards.map((card) => (
//                         <Card
//                             key={card.title}
//                             className={clsx("w-[300px] flex flex-col justify-between", {
//                                 "border-2 border-primary": card.title === "Unlimited Saas",
//                             })}
//                         >
//                             <CardHeader>
//                                 <CardTitle
//                                     className={clsx("", {
//                                         "text-muted-foreground": card.title !== "Unlimited Saas",
//                                     })}
//                                 >
//                                     {card.title}
//                                 </CardTitle>
//                                 <CardDescription>{card.description}</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <span className="text-3xl font-bold">{card.price}</span>
//                                 <span className="text-muted-foreground">/m</span>
//                             </CardContent>
//                             <CardFooter className="flex flex-col items-start gap-4">
//                                 <div>
//                                     {card.features.map((feature) => (
//                                         <div key={feature} className="flex gap-2 items-center">
//                                             <Check className="text-muted-foreground" />
//                                             <p>{feature}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <Link
//                                     href={`/agency?plan=${card.priceId}`}
//                                     className={clsx("w-full text-center bg-primary p-2 rounded-md", {
//                                         "!bg-muted-foreground": card.title !== "Unlimited Saas",
//                                     })}
//                                 >
//                                     Get Started
//                                 </Link>
//                             </CardFooter>
//                         </Card>
//                     ))}
//                 </div>
//             </section>
//         </>
//     );
// };

// export default Page;