// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { daysAgo } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const VideoDetailHeader = ({
	title,
	createdAt,
	userImg,
	username,
	videoId,
	ownerId,
	visibility,
	thumbnailUrl,
	id,
}: VideoDetailHeaderProps) => {
	const router = useRouter();

	const [copied, setCopied] = useState(false);

	const handleCopyLink = () => {
		navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
		setCopied(true);
	};

	useEffect(() => {
		const changeChecked = setTimeout(() => {
			if (copied) setCopied(false);
		}, 2000);

		return () => clearTimeout(changeChecked);
	}, [copied]);

	return (
		<header className="detail-header">
			<aside className="user-info">
				<h1>{title}</h1>
				<figure>
					<button onClick={() => router.push(`/profile/${ownerId}`)}>
						<Image
							src={userImg || ""}
							alt="User"
							width={24}
							height={24}
							className=" rounded-full"
						/>
						<h2>{username || "Yanko"}</h2>
						<figcaption>
							<span className=" mt-1">·</span>
							<p>{daysAgo(createdAt)}</p>
						</figcaption>
					</button>
				</figure>
			</aside>
			<aside className="cta">
				<button onClick={handleCopyLink}>
					<Image
						src={
							copied
								? "/assets/images/checked.png"
								: "/assets/icons/link.svg"
						}
						alt="copy"
						width={24}
						height={24}
					/>
				</button>
			</aside>
		</header>
	);
};

export default VideoDetailHeader;
