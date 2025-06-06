import { TopBanner } from "@site/src/components/Sponsors/TopBanner";

export const TopBanners = () => {
	const items = [
		{
			imgSrc: "/ads/sponsor-banner-1.png",
			mobileImgSrc: "/ads/sponsor-banner-small-1.png",
			url: "https://startr.style/",
			name: "Startr.Style",
			description: "Create a website that looks great and is easy to manage.",
		},
	];

	// Randomly select an item to display
	let selectedItemIdx = Math.floor(Math.random() * items.length);

	return <TopBanner items={[items[selectedItemIdx]]} />;
};
