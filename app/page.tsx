"use client";

import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import * as React from "react";

import { FeedbacksLogo } from "@/components/icons";

declare global {
  interface Window {
    Clerk: any;
  }
}

// Updated features array with more specific capabilities
const features = [
  {
    title: "AI-Powered Analysis",
    description:
      "Our AI analyzes feedback sentiment, categorizes responses, and provides actionable insights automatically.",
  },
  {
    title: "Brand Accountability",
    description:
      "Welcome to the era of brand accountability, where customers have a voice over the decisions and actions brand make.",
  },
  {
    title: "Get Feedback from humans not bots",
    description:
      "Trust that the feedbacks from customers are from humans, not bots.",
  },
  {
    title: "Real-Time Engagement",
    description:
      "Instant notifications and live updates when customers leave feedback, with immediate response capabilities.",
  },
  {
    title: "Multi-Brand Management",
    description:
      "Manage feedback for multiple brands, products, or services from a single dashboard with organized categories.",
  },
  {
    title: "Smart Analytics Dashboard",
    description:
      "Comprehensive analytics showing feedback trends, sentiment analysis, and customer satisfaction metrics.",
  },
  {
    title: "Customizable Forms",
    description:
      "Create branded feedback forms with custom fields, ratings, and multiple response types.",
  },
  {
    title: "Integration Ready",
    description:
      "Connect with your existing tools through our API, including CRM systems and analytics platforms.",
  },
];

// New comparison section data
const comparisons = [
  {
    category: "Feedback Collection",
    feedbacks: "AI-powered forms, Multiple channels, Real-time notifications",
    others: "Basic forms, Limited channels, Delayed responses",
  },
  {
    category: "Analytics",
    feedbacks:
      "Advanced AI analysis, Sentiment tracking, Automated categorization",
    others: "Basic metrics, Manual analysis, Limited insights",
  },
  {
    category: "Brand Management",
    feedbacks: "Multiple brands, Custom categories, Unified dashboard",
    others: "Single brand focus, Fixed categories, Separate logins",
  },
  {
    category: "User Experience",
    feedbacks: "Modern interface, Real-time updates, Mobile optimized",
    others: "Traditional interface, Refresh needed, Desktop focused",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-x-2">
            <FeedbacksLogo size={32} />
            <p className="font-bold text-inherit">Feedbacks</p>
          </div>
          <Button as={Link} color="danger" href="app" variant="shadow">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
              The Era of Transparent Feedback
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
              Transform how you collect and manage feedback with our AI-powered
              platform. Real insights, real-time responses, real results.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                as={Link}
                color="danger"
                href="/app"
                size="lg"
                variant="shadow"
              >
                Start for Free
              </Button>
              <Button as={Link} href="#features" size="lg" variant="ghost">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-20 bg-gradient-to-b from-background to-background/50"
          id="features"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Feedbacks
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-content1 shadow-medium"
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-content1 shadow-medium hover:shadow-large transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-content1/50 to-background">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">How Feedbacks Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold">Create Your Brand</h3>
                <p className="text-sm text-foreground/70">
                  Set up your brand profile and customize feedback forms
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold">Collect Feedback</h3>
                <p className="text-sm text-foreground/70">
                  Share forms and receive real-time responses
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold">AI Analysis</h3>
                <p className="text-sm text-foreground/70">
                  Get automated insights and sentiment analysis
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold">Take Action</h3>
                <p className="text-sm text-foreground/70">
                  Respond to feedback and improve your business
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Feedbacks?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4">Features</th>
                    <th className="text-left p-4 text-primary">Feedbacks</th>
                    <th className="text-left p-4 text-foreground/70">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item, index) => (
                    <tr key={index} className="border-t border-divider">
                      <td className="p-4 font-medium">{item.category}</td>
                      <td className="p-4 text-primary">{item.feedbacks}</td>
                      <td className="p-4 text-foreground/70">{item.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-danger/10 to-primary/10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Feedback Process?
            </h2>
            <p className="text-xl text-foreground/80">
              Join thousands of brands already using Feedbacks to improve their
              products and services.
            </p>
            <Button
              as={Link}
              color="danger"
              href="/app"
              size="lg"
              variant="shadow"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-content1 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <FeedbacksLogo size={24} />
              <p className="font-bold">Feedbacks</p>
            </div>
            <p className="text-sm text-foreground/70">
              Making feedback collection and management seamless and effective.
            </p>
          </div>
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      className="text-sm text-foreground/70 hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

function PageOld() {
  return (
    <section className="flex flex-col">
      <div className={"flex flex-row items-center gap-x-1 z-10"}>
        <FeedbacksLogo size={32} />
        <p className="font-bold text-inherit">Feedbacks</p>
      </div>
      {/*<section className="items-start">
        <HomeNav />
      </section>*/}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <section className={"text-center w-full px-3 space-y-2"}>
          <div className={"font-bold text-4xl"}>Let&apos;s send some</div>
          {/*<div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">*/}
          {/*  <div*/}
          {/*    className={cn(*/}
          {/*      "absolute inset-0",*/}
          {/*      "[background-size:40px_40px]",*/}
          {/*      "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",*/}
          {/*      "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",*/}
          {/*    )}*/}
          {/*  />*/}
          {/*  /!* Radial gradient for the container to give a faded look *!/*/}
          {/*  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>*/}
          {/*  <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">*/}
          {/*    Backgrounds*/}
          {/*  </p>*/}
          {/*</div>*/}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
          <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-3xl font-bold text-transparent sm:text-7xl">
            Let&apos;s send
          </p>
          <div
            className={
              "font-extrabold text-7xl lg:text-9xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#000000] to-[#4b4b4b] dark:from-[#FFFFFF] dark:to-[#4B4B4B]"
            }
          >
            Feedback
          </div>
          {/*<div className={"font-bold text-5xl"}>All in one place</div>*/}
        </section>

        {/*<div className={title({ color: "foreground", size: "3xl" })}>
          Feedbacks
        </div>
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title()}>Make&nbsp;</h1>
          <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
          <br />
          <h1 className={title()}>
            websites regardless of your design experience.
          </h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Beautiful, fast and modern React UI library.
          </h2>
        </div>*/}

        {/*<div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>*/}

        <Button as={Link} color={"danger"} href={"app"} variant={"shadow"}>
          Get started
        </Button>

        {/*<div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="shadow">
            <span>
              Get started by editing <Code color="primary">app/page.tsx</Code>
            </span>
          </Snippet>
        </div>*/}
      </section>

      {/*<footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p>
        </Link>
      </footer>*/}
    </section>
  );
}
