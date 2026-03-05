import { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
    title: "Pricing | EdTech Platform",
    description: "Invest in your future with our elite tech education programs. Flexible payment options and a 30-day money-back guarantee.",
    openGraph: {
        title: "Pricing Plans | EdTech Platform",
        description: "Compare our tech education programs and choose the one that fits your career goals. One-time and installment plans available.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pricing Plans | EdTech Platform",
        description: "Invest in your future with our top-tier tech education programs.",
    }
};

export default function PricingPage() {
    return <PricingPageClient />;
}
