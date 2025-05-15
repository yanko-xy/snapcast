// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { ICONS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DropdownList from "@/components/DropdownList";
import RecordScreen from "./RecordScreen";
import { withI18N } from "@/wrapper/I18NWrapper";

const Header = (
	{ title, subHeader, userImg }: SharedHeaderProps,
	t: I18NFunction
) => {
	return (
		<header className="header">
			<section className="header-container">
				<div className="details">
					{userImg && (
						<Image
							src={userImg}
							width={66}
							height={66}
							alt="user"
							className=" rounded-full"
						/>
					)}

					<article>
						<p>{subHeader}</p>
						<h1>{title}</h1>
					</article>
				</div>

				<aside>
					<Link href="/upload">
						<Image
							src="/assets/icons/upload.svg"
							alt="upload"
							width={16}
							height={16}
						/>
					</Link>
					<RecordScreen />
				</aside>
			</section>

			<section className="search-filter">
				<div className="search">
					<input type="text" placeholder={t("home.search")} />
					<Image
						src="/assets/icons/search.svg"
						alt="search"
						width={16}
						height={16}
					/>
				</div>
				<DropdownList />
			</section>
		</header>
	);
};

export default withI18N<SharedHeaderProps>(Header);
