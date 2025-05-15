import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { satoshi } from "@/fonts/font";
import { useStore } from "zustand";
import { dir } from "i18next";
import { languages } from "@/lib/i18n/setting";

import "./globals.css";

const geistKarla = Karla({
	variable: "--font-geist-karla",
	subsets: ["latin"],
});

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
	title: "SnapCast",
	description: "A Screen Sharing App",
	icons: {
		icon: "/assets/icons/logo.svg",
	},
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{
		lng: string;
	}>;
}>) {
	const { lng } = await params;

	return (
		<html lang={lng} dir={dir(lng)}>
			<body
				className={`${geistKarla.variable} ${satoshi.variable} font-karla antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
