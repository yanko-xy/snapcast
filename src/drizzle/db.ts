// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getXataClient } from "@/xata";
import { drizzle } from "drizzle-orm/xata-http";

const xata = getXataClient();

export const db = drizzle(xata);
