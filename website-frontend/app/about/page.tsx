import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
    title: "About Us | EdTech Platform",
    description: "Learn about our mission to transform lives through tech education and our journey to becoming an industry leader.",
    openGraph: {
        title: "About Us | EdTech Platform",
        description: "Learn about our mission to transform lives through tech education and our journey to becoming an industry leader.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | EdTech Platform",
        description: "Learn about our mission to transform lives through tech education and our journey to becoming an industry leader.",
    }
};

export default function AboutPage() {
    return <AboutPageClient />;
}
