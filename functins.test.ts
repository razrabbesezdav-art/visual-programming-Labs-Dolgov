import { describe, it, expect, vi, beforeEach} from "vitest";
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs/promises');

import {csvToJSON, formatCSVFileToJSONFile} from './functions.ts'

describe("Тесты функции csvToJSON", () => {
    it("Вызов функции с корректными данными", () => {
        expect(csvToJSON(["p1;p2", "1;A", "2;B"], ";")).toEqual([{"p1": 1, "p2": "A"}, {"p1": 2, "p2": "B"}]);
    })
    
    it("Вызов функции с некорректными данными", () => {
        expect(() => csvToJSON(["p1;p2", "1;A;G;W", "2;B;1"], ";")).toThrow("Error");
    })
});

describe("Тесты функции formatCSVFileToJSONFile", () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
    });
    it("Вызов функции с корректными данными", async () => {
        const mockCsvContent = `p1;p2\n1;A\n2;B`;
        const expectedJson = JSON.stringify([
            { "p1": 1, "p2": "A" },
            { "p1": 2, "p2": "B" }
        ], null, 2);

        vi.mocked(readFile).mockResolvedValue(mockCsvContent);
    
        await formatCSVFileToJSONFile('input.csv', 'output.json', ';');

        expect(writeFile).toHaveBeenCalledWith('output.json', expectedJson);
    });
});
