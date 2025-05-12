// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import aj from "@/lib/aarcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import ip from "@arcjet/ip";
import { describe } from "node:test";

const emailValidation = aj.withRule(
	validateEmail({
		mode: "LIVE",
		block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
	})
);

const rateLimit = aj.withRule(
	slidingWindow({
		mode: "LIVE",
		interval: "2m",
		max: 2,
		characteristics: ["fingerprint"],
	})
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
	const session = await auth.api.getSession({ headers: await headers() });

	let userId: string;

	if (session?.user?.id) {
		userId = session.user.id;
	} else {
		userId = ip(req) || "127.0.0.1";
	}

	if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
		const body = await req.clone().json();

		if (typeof body.email === "string") {
			return emailValidation.protect(req, { email: body.email });
		}
	}

	return rateLimit.protect(req, { fingerprint: userId });
};

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
	const decision = await protectedAuth(req);

	if (decision.isDenied()) {
		if (decision.reason.isEmail()) {
			throw new Error("Email validation failed");
		}

		if (decision.reason.isRateLimit()) {
			throw new Error("Rate Limit Exceeded");
		}

		if (decision.reason.isShield()) {
			throw new Error(
				"Shielded turned on, protected against malicious actions"
			);
		}
	}

	return authHandlers.POST(req);
};
