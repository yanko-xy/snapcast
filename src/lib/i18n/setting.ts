// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const fallbackLng = "en";
export const languages = [fallbackLng, "zh"];
export const defaultNS = "translation";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
	return {
		// debug: true,
		supportedLngs: languages,
		fallbackLng,
		lng,
		fallbackNS: defaultNS,
		defaultNS,
		ns,
	};
}
