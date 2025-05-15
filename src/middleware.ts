// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import aj from "./lib/aarcjet";
import { createMiddleware, detectBot, shield } from "@arcjet/next";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "./lib/i18n/setting";

acceptLanguage.languages(languages);

export default function i18nMiddleare(request: NextRequest) {
	const lng =
		acceptLanguage.get(request.headers.get("Accept-Language")) ||
		fallbackLng;

	if (
		!languages.some((loc) =>
			request.nextUrl.pathname.startsWith(`/${loc}`)
		) &&
		!request.nextUrl.pathname.startsWith("/_next")
	) {
		return NextResponse.redirect(
			new URL(`/${lng}${request.nextUrl.pathname}`, request.url)
		);
	}

	const response = NextResponse.next();
	response.cookies.set("lng", lng, {
		path: "/",
		httpOnly: true,
	});
	return response;
}

// export async function middleware(request: NextRequest, response: NextResponse) {
// 	const session = await auth.api.getSession({
// 		headers: await headers(),
// 	});

// 	if (!session) {
// 		return NextResponse.redirect(new URL("/sign-in", request.url));
// 	}

// 	return NextResponse.next();
// }

// const validate = aj.withRule(shield({ mode: "LIVE" })).withRule(
// 	detectBot({
// 		mode: "LIVE",
// 		allow: ["CATEGORY:SEARCH_ENGINE", "G00G1E_CRAWLER"],
// 	})
// );

// export default createMiddleware(validate);

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)",
	],
};
