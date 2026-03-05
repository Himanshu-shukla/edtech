import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
    title: "Contact Us | EdTech Platform",
    description: "Have questions? Our team is here to help you fast-track your career with personalized guidance and support.",
    openGraph: {
        title: "Contact Us | EdTech Platform",
        description: "Get in touch with our career experts. We're here to help you choose the right program and start your journey.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | EdTech Platform",
        description: "Connect with us for personalized career guidance and support.",
    }
};

export default function ContactPage() {
    return <ContactPageClient />;
}
