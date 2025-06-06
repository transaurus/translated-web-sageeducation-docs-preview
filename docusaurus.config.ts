import { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
	title: "Sage WebUI",
	tagline: "ChatGPT-Style WebUI for LLMs (Formerly Ollama WebUI)",
	favicon: "images/favicon.png",

	// Set the production url of your site here
	url: "https://sage.education",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "Startr", // Usually your GitHub org/user name.
	projectName: "docs", // Usually your repo name.

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
		i18n: {
			defaultLocale: "en",
			locales: ["en", "ja"],
			localeConfigs: {
				en: {
					label: "English",
				},
				ja: {
					label: "日本語",
				},
			},
		},

	// Enable Mermaid for diagrams
	markdown: {
		mermaid: true,
	},
	themes: ["@docusaurus/theme-mermaid"],

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					routeBasePath: "/",
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: "https://github.com/Startr/WEB-Sage.Education-docs/blob/main",
					exclude: ["**/tab-**/**"],
				},
				// blog: false,
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					// editUrl:
					// "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		// image: "images/docusaurus-social-card.jpg",
		navbar: {
			title: "Sage WebUI",
			logo: {
				src: "images/logo.png",
				srcDark: "images/logo-dark.png",
			},
			items: [
				// {
				// 	type: "docSidebar",
				// 	position: "left",
				// 	sidebarId: "pipelines",
				// 	label: "Pipelines",
				// },

				// {
				//   type: "docSidebar",
				//   sidebarId: "blog",
				//   position: "left",
				//   label: "Blog",
				// },

				// {
				//   href: "/blog",
				//   label: "Blog",
				//   position: "left",
				// },
				{
					href: "https://github.com/Startr/AI-WEB-openwebui",
					position: "right",
					className: "header-github-link",
					"aria-label": "GitHub repository",
				},
				{
					href: "https://discord.com/channels/1074411230040703046/1074411231030550632",
					position: "right",
					className: "header-discord-link",
					"aria-label": "Discord server",
				},
			],
		},
		footer: {
			logo: {
				src: "images/logo-dark.png",
				height: 100,
			},
			style: "light",
			links: [
				{
					title: "Docs",
					items: [
						{
							label: "Getting Started",
							to: "getting-started",
						},
						{
							label: "FAQ",
							to: "faq",
						},
					],
				},
				{
					title: "Community",
					items: [
						{
							label: "GitHub",
							href: "https://github.com/Startr/AI-WEB-openwebui",
						},
						{
							label: "Discord",
							href: "https://discord.com/channels/1074411230040703046/1074411231030550632",
						},
					],
				},
				{
					title: "More",
					items: [
						{
							label: "Release Notes",
							to: "https://github.com/Startr/AI-WEB-openwebui/blob/main/CHANGELOG.md",
						},
						{
							label: "About",
							to: "https://sage.education",
						},
					],
				},
			],
			// copyright: `Copyright © ${new Date().getFullYear()} OpenWebUI`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
	plugins: [require.resolve("docusaurus-lunr-search")],
};

export default config;
