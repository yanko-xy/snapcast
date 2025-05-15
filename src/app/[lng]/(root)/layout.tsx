// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import Navbar from "@/components/Navbar";
import React, { type ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
};

export default layout;
