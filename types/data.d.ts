import type { ReactNode } from "react";

declare module "@/data/features" {
  export interface FeatureItem { icon: ReactNode; title: string; description: string }
  export const features: FeatureItem[];
}

declare module "@/data/howItWorks" {
  export interface HowItWorksItem { icon: ReactNode; title: string; description: string }
  export const howItWorks: HowItWorksItem[];
}

declare module "@/data/testimonial" {
  export interface TestimonialItem { quote: string; author: string; image: string; role: string; company: string }
  export const testimonial: TestimonialItem[];
}

declare module "@/data/faqs" {
  export interface FAQItem { question: string; answer: string }
  export const faqs: FAQItem[];
}
