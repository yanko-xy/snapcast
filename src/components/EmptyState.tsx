// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import Image from "next/image";
import React from "react";

const EmptyState = ({ title, icon, description }: EmptyStateProps) => {
	return (
		<section className="empty-state">
			<div>
				<Image src={icon} alt="icon" width={46} height={46} />
			</div>
			<article>
				<h1>{title}</h1>
				<p>{description}</p>
			</article>
		</section>
	);
};

export default EmptyState;
