// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { fallbackLng, getOptions } from "./setting";

export const initI18next = async (lng: string, ns: string) => {
	const i18nInstance = createInstance();
	await i18nInstance
		.use(initReactI18next)
		.use(
			resourcesToBackend(
				(language: string, namespace: string) =>
					import(
						`../../../public/locales/${language}/${namespace}.json`
					)
			)
		)
		.init(getOptions(lng, ns));
	return i18nInstance;
};

export async function useTranslationUtil(
	lng: string,
	ns: string,
	options?: any
) {
	const i18nInstance = await initI18next(lng, ns);
	return {
		t: i18nInstance.getFixedT(
			lng,
			Array.isArray(ns) ? ns[0] : ns,
			options?.keyPrefix ?? null
		),
		i18n: i18nInstance,
	};
}

export async function useTranslation(params: Promise<Record<string, any>>) {
	const lng = (await params)["lng"] ?? fallbackLng;
	const i18nInstance = await initI18next(lng, "common");
	return {
		t: i18nInstance.getFixedT(lng, "common"),
		i18n: i18nInstance,
	};
}

export async function getServerTranslation(lng: string) {
	const { t } = await useTranslationUtil(lng, "common");
	return t;
}
