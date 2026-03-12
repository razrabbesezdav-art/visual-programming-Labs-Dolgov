import { describe, it, expect } from "vitest";
import { readFile, writeFile } from 'node:fs/promises';

import {csvToJSON, formatCSVFileToJSONFile} from './functions.ts'

describe("Тесты функции csvToJSON", () => {
    it("Вызов функции с корректными данными", () => {
        expect(csvToJSON(["p1;p2", "1;A", "2;B"], ";")).toEqual([{"p1": 1, "p2": "A"}, {"p1": 2, "p2": "B"}]);
    })
    
    it("Вызов функции с некорректными данными", () => {
        expect(() => csvToJSON(["p1;p2", "1;A;G;W", "2;B;1"], ";")).toThrow("Error");
    })
});