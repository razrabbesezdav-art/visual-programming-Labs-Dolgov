import { describe, it, expect, expectTypeOf } from 'vitest';
import { 
  QueryBuilder, 
  query, 
  ID_card,
  ValidateWhere,
  ValidateGroupBy,
  ValidateHaving,
  ValidateSort
} from './lab4';

describe('QueryBuilder', () => {
  const testData: ID_card[] = [
    { id: 1, name: 'John', address: 'NY', age: 25, phoneNumber: '123-456-7890' },
    { id: 2, name: 'Jane', address: 'LA', age: 30, phoneNumber: '234-567-8901' },
    { id: 3, name: 'Bob', address: 'NY', age: 25, phoneNumber: '345-678-9012' },
    { id: 4, name: 'Alice', address: 'LA', age: 35, phoneNumber: '456-789-0123' },
    { id: 5, name: 'Charlie', address: 'NY', age: 30, phoneNumber: '567-890-1234' }
  ];

  describe('Базовые операции', () => {
    it('where фильтрация', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .build()(testData);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.age === 25)).toBe(true);
    });

    it('сортировка', () => {
      const result = query<ID_card>()
        .sort('name')
        .build()(testData);
      expect(result[0].name).toBe('Alice');
      expect(result[4].name).toBe('John');
    });

    it('groupBy после where', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .build()(testData);
      expect(result).toBeDefined();
    });

    it('having после groupBy', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 1)
        .build()(testData);
      expect(result).toBeDefined();
    });
  });

  describe('Последовательности операций', () => {
    it('полная цепочка: where -> groupBy -> having -> sort', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 1)
        .sort('name')
        .build()(testData);
      expect(result).toBeDefined();
    });

    it('sort в начале', () => {
      const result = query<ID_card>()
        .sort('name')
        .build()(testData);
      expect(result).toBeDefined();
    });

    it('sort после where', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .sort('name')
        .build()(testData);
      expect(result).toBeDefined();
    });
  });

  describe('Проверка типов', () => {
    it('типы параметров where и sort', () => {
      const builder = query<ID_card>();
      expectTypeOf(builder.where).parameter(0).toEqualTypeOf<keyof ID_card>();
      expectTypeOf(builder.sort).parameter(0).toEqualTypeOf<keyof ID_card>();
    });

    it('тип возврата после цепочки', () => {
      const builder = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 0)
        .sort('name');
      expectTypeOf(builder).toEqualTypeOf<QueryBuilder<ID_card, 'sort'>>();
    });
  });

  describe('Валидация фаз', () => {
    it('проверка переходов между фазами', () => {
      expectTypeOf<ValidateWhere<'initial'>>().toEqualTypeOf<'where'>();
      expectTypeOf<ValidateGroupBy<'where'>>().toEqualTypeOf<'groupBy'>();
      expectTypeOf<ValidateHaving<'groupBy'>>().toEqualTypeOf<'having'>();
      expectTypeOf<ValidateSort<'having'>>().toEqualTypeOf<'sort'>();
      expectTypeOf<ValidateSort<'groupBy'>>().toEqualTypeOf<never>();
    });
  });

  describe('Интеграционные тесты', () => {
    it('запрос с where и sort', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .sort('name')
        .build()(testData);
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
    });

    it('пустой результат', () => {
      const result = query<ID_card>()
        .where('age', 100)
        .groupBy('address')
        .having(group => group.items.length > 0)
        .sort('name')
        .build()(testData);
      expect(result).toHaveLength(0);
    });
  });
});