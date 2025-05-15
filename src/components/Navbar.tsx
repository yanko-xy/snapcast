// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const user = session?.user;

	return (
		<header className=" navbar">
			<nav>
				<Link href="/">
					<Image
						src="/assets/icons/logo.svg"
						alt="logo"
						width={32}
						height={32}
					/>
					<h1>SnapCast</h1>
				</Link>

				{user && (
					<figure>
						<button
							onClick={() => router.push(`/profile/${user.id}`)}
						>
							<Image
								src={user.image || ""}
								alt="User"
								width={36}
								height={36}
								className=" rounded-full aspect-square"
							/>
						</button>
						<button onClick={() => router.push("/sign-in")}>
							<Image
								src="/assets/icons/logout.svg"
								alt="logout"
								width={24}
								height={24}
								className=" rotate-180"
							/>
						</button>
					</figure>
				)}
			</nav>
		</header>
	);
};

export default Navbar;
