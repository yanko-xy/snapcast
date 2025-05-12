// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import arcjet from "@arcjet/next";
import { getEnv } from "./utils";

const aj = arcjet({
	key: getEnv("ARCJET_API_KEY"),
	rules: [],
});

export default aj;
