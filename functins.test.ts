import { describe, it, expect } from "vitest";
import { readFile, writeFile } from 'node:fs/promises';

import {csvToJSON, formatCSVFileToJSONFile} from './functions.ts'