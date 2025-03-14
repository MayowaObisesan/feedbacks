export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Feedback",
  description:
    "The platform to send and receive feedbacks that matter about your brand, products, events and services.",
  navItems: [
    /*{
      label: "Home",
      href: "/app",
    },*/
    // {
    //   label: "Docs",
    //   href: "/docs",
    // },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    // {
    //   label: "About",
    //   href: "/about",
    // },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    /*{
      label: "me",
      href: "/app/me",
    },*/
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/app",
    },
    {
      label: "me",
      href: "/app/me",
    },
    /*{
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },*/
  ],
  links: {
    github: "https://github.com/MayowaObisesan",
    twitter: "https://x.com/amdblessed",
    docs: "https://nextui.org",
    discord: "https://discord.gg/amtheblessed",
    sponsor: "https://patreon.com/amtheblessed",
  },
};
