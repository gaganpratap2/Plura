import { Stripe, loadStripe } from "@stripe/stripe-js";

const stripePromises = new Map<string, Promise<Stripe | null>>();

export const getStripe = (connectedAccountId?: string) => {
    const key = connectedAccountId ?? "default";
    if (!stripePromises.has(key)) {
        stripePromises.set(
            key,
            loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "", {
                stripeAccount: connectedAccountId,
                locale: "en",
            })
        );
    }
    return stripePromises.get(key)!;
};
