import { describe, it, expect, vi, beforeEach} from "vitest";
import {query, where, sort, groupBy, ID_card, having, Group} from './lab4.ts'

describe('Тестирование функции query и конвейера обработки данных', () => {
    let testData: ID_card[];

    beforeEach(() => {
        testData = [
            { id: 1, name: "Ivan", address: "Moscow", age: 25, phoneNumber: "111" },
            { id: 2, name: "Ivan", address: "Tomsk", age: 30, phoneNumber: "222" },
            { id: 3, name: "Oleg", address: "Moscow", age: 20, phoneNumber: "333" },
            { id: 4, name: "Ivan", address: "Moscow", age: 22, phoneNumber: "444" },
        ];
    });

    it('должна выполнять простую фильтрацию и сортировку', () => {
        const pipeline = query<ID_card>(
            where("name", "Ivan"),
            sort("age")
        );

        const result = pipeline(testData);

        expect(result).toHaveLength(3);
        expect(result[0].age).toBe(22); // Самый молодой Иван
        expect(result[2].age).toBe(30); // Самый старший Иван
    });

    it('должна корректно трансформировать данные в группы (GroupBy)', () => {
        const pipeline = query<ID_card>(
            groupBy("address")
        );

        const result = pipeline(testData);

        expect(result).toHaveLength(2);
        const moscowGroup = result.find((g: Group<ID_card, "address">) => g.key === "Moscow");
        expect(moscowGroup?.items).toHaveLength(3);
    });

    it('должна работать сложная цепочка (Where -> Sort -> GroupBy -> Having)', () => {
        const pipeline = query<ID_card>(
            where("name", "Ivan"),
            sort("age"),
            groupBy("address"),
            having(g => g.items.length > 1)
        );

        const result = pipeline(testData);

        expect(result).toHaveLength(1);
        expect(result[0].key).toBe("Moscow");
        expect(result[0].items[0].age).toBe(22); 
    });

    it('должна возвращать пустой массив, если условия фильтрации не выполнены', () => {
        const pipeline = query<ID_card>(
            where("name", "Unknown User")
        );

        const result = pipeline(testData);
        expect(result).toEqual([]);
    });
})