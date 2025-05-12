// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import Image from "next/image";
import React, { useState } from "react";

const DropdownList = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className=" relative">
			<div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
				<div className="filter-trigger">
					<figure>
						<Image
							src="/assets/icons/hamburger.svg"
							alt="menu"
							width={14}
							height={14}
						/>
						Most ecent
					</figure>
					<Image
						src="/assets/icons/arrow-down.svg"
						width={20}
						height={20}
						alt="arrow-down"
					/>
				</div>
			</div>

			{isOpen && (
				<ul className="dropdown">
					{["Most recent", "Most liked"].map((option) => (
						<li key={option} className="list-item">
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DropdownList;
