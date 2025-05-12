// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "./.env" });

export default defineConfig({
	schema: "./src/drizzle/schema.ts",
	out: "./src/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL_POSTGRES!,
	},
});
