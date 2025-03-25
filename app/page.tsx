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

export default function Page() {
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
