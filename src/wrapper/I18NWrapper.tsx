// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getServerTranslation } from "@/lib/i18n";
import { fallbackLng } from "@/lib/i18n/setting";
import { cookies } from "next/headers";
import React from "react";

export const withI18N = <T,>(
	WrappedComponent: (props: T, t: any) => React.ReactNode
) => {
	return async function WithI18NComponent(props: T) {
		const cookieStore = await cookies();
		const lng = cookieStore.get("lng")?.value;
		const t = await getServerTranslation(lng ?? fallbackLng);
		return WrappedComponent(props, t);
	};
};
