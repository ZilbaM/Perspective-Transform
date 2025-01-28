import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "React Perspective Transform",
  tagline: "React library for perspective transforms and projection mapping",
  favicon: "logo.png",

  // Set the production url of your site here
  url: "https://zilbam.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/react-perspective-transform/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ZilbaM", // Usually your GitHub org/user name.
  projectName: "react-perspective-transform", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/ZilbaM/react-perspective-transform/edit/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/social-card.jpg", // Replace with your project's social card
    navbar: {
      title: "PerspectiveTransform",
      logo: {
        alt: "PerspectiveTransform Logo",
        src: "logo.png",
      },
      items: [
        {
          href: "https://github.com/ZilbaM/react-perspective-transform",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/",
            },
            {
              label: "API Reference",
              to: "/api",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Issues",
              href: "https://github.com/ZilbaM/react-perspective-transform/issues",
            },
            {
              label: "Discussions",
              href: "https://github.com/ZilbaM/react-perspective-transform/discussions",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/ZilbaM/react-perspective-transform",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ZilbaM. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
