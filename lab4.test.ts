import { describe, it, expect, expectTypeOf } from 'vitest';
import { 
  QueryBuilder, 
  query, 
  where, 
  sort, 
  groupBy, 
  having,
  ID_card,
  QueryPhase,
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
    it('должен создавать QueryBuilder с начальным состоянием', () => {
      const builder = query<ID_card>();
      expect(builder).toBeInstanceOf(QueryBuilder);
    });

    it('should apply where filter correctly', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .build()(testData);

      expect(result).toHaveLength(2);
      expect(result.every(item => item.age === 25)).toBe(true);
    });

    it('should apply multiple where filters correctly', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .where('address', 'NY')
        .build()(testData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ 
        id: 1, 
        name: 'John', 
        address: 'NY', 
        age: 25, 
        phoneNumber: '123-456-7890' 
      });
    });

    it('should apply sort correctly', () => {
      const result = query<ID_card>()
        .sort('name')
        .build()(testData);

      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
      expect(result[3].name).toBe('Jane');
      expect(result[4].name).toBe('John');
    });

    it('should apply multiple sorts correctly (last sort wins)', () => {
      const result = query<ID_card>()
        .sort('name')
        .sort('age')
        .build()(testData);

      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(25);
      expect(result[2].age).toBe(30);
      expect(result[3].age).toBe(30);
      expect(result[4].age).toBe(35);
    });

    it('should apply groupBy correctly', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .build()(testData);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply having correctly', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 1)
        .build()(testData);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply having with multiple groups', () => {
      const result = query<ID_card>()
        .groupBy('address')
        .having(group => group.items.length >= 2)
        .build()(testData);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Последовательности операций', () => {
    it('should allow where -> groupBy -> having -> sort', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 1)
        .sort('name')
        .build()(testData);

      expect(result).toBeDefined();
    });

    it('should allow sort at the beginning', () => {
      const result = query<ID_card>()
        .sort('name')
        .build()(testData);

      expect(result).toBeDefined();
    });

    it('should allow sort after where', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .sort('name')
        .build()(testData);

      expect(result).toBeDefined();
    });

    it('should allow sort after having', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 1)
        .sort('name')
        .build()(testData);

      expect(result).toBeDefined();
    });

    it('should allow multiple where clauses', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .where('address', 'NY')
        .groupBy('name')
        .having(group => group.items.length > 0)
        .sort('id')
        .build()(testData);

      expect(result).toBeDefined();
    });

    it('should allow multiple groupBy clauses', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .groupBy('name')
        .having(group => group.items.length > 0)
        .sort('id')
        .build()(testData);

      expect(result).toBeDefined();
    });

    it('should allow multiple sort clauses', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 0)
        .sort('name')
        .sort('id')
        .build()(testData);

      expect(result).toBeDefined();
    });
  });

  describe('Проверка типов', () => {
    it('should validate where parameter types', () => {
      const builder = query<ID_card>();
      
      expectTypeOf(builder.where).parameter(0).toEqualTypeOf<keyof ID_card>();
      expectTypeOf(builder.where).parameter(1).toMatchTypeOf<ID_card[keyof ID_card]>();
      
      builder.where('age', 25);
      builder.where('name', 'John');
      builder.where('address', 'NY');
      builder.where('phoneNumber', '123');
    });

    it('should validate sort parameter types', () => {
      const builder = query<ID_card>();
      
      expectTypeOf(builder.sort).parameter(0).toEqualTypeOf<keyof ID_card>();
      
      builder.sort('age');
      builder.sort('name');
      builder.sort('address');
      builder.sort('id');
      builder.sort('phoneNumber');
    });

    it('should validate groupBy parameter types', () => {
      const builder = query<ID_card>().where('age', 25);
      
      expectTypeOf(builder.groupBy).parameter(0).toEqualTypeOf<keyof ID_card>();
      
      builder.groupBy('age');
      builder.groupBy('name');
      builder.groupBy('address');
      builder.groupBy('id');
      builder.groupBy('phoneNumber');
    });

    it('should validate having parameter types', () => {
      const builder = query<ID_card>().where('age', 25).groupBy('address');
      
      expectTypeOf(builder.having).parameter(0).toBeFunction();
      expectTypeOf(builder.having).returns.toEqualTypeOf<QueryBuilder<ID_card, 'having'>>();
    });

    it('should preserve type through chain', () => {
      const builder = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 0)
        .sort('name');

      expectTypeOf(builder).toEqualTypeOf<QueryBuilder<ID_card, 'sort'>>();
    });
  });

  describe('Валидация фаз', () => {
    it('should validate phase transitions', () => {
      type TestWhere = ValidateWhere<'initial'>;
      expectTypeOf<TestWhere>().toEqualTypeOf<'where'>();
      
      type TestWhereInvalid = ValidateWhere<'where'>;
      expectTypeOf<TestWhereInvalid>().toEqualTypeOf<never>();
      
      type TestGroupBy = ValidateGroupBy<'where'>;
      expectTypeOf<TestGroupBy>().toEqualTypeOf<'groupBy'>();
      
      type TestGroupByInvalid = ValidateGroupBy<'initial'>;
      expectTypeOf<TestGroupByInvalid>().toEqualTypeOf<never>();
      
      type TestHaving = ValidateHaving<'groupBy'>;
      expectTypeOf<TestHaving>().toEqualTypeOf<'having'>();
      
      type TestHavingInvalid = ValidateHaving<'where'>;
      expectTypeOf<TestHavingInvalid>().toEqualTypeOf<never>();
      
      type TestSortFromHaving = ValidateSort<'having'>;
      expectTypeOf<TestSortFromHaving>().toEqualTypeOf<'sort'>();
      
      type TestSortFromWhere = ValidateSort<'where'>;
      expectTypeOf<TestSortFromWhere>().toEqualTypeOf<'sort'>();
      
      type TestSortFromInitial = ValidateSort<'initial'>;
      expectTypeOf<TestSortFromInitial>().toEqualTypeOf<'sort'>();
      
      type TestSortInvalid = ValidateSort<'groupBy'>;
      expectTypeOf<TestSortInvalid>().toEqualTypeOf<never>();
    });
  });

  describe('Обработка ошибок', () => {
    it('should throw error when where called after where', () => {
      const builder = query<ID_card>().where('age', 25);
      
      expect(() => {
        (builder as any).where('name', 'John');
      }).toThrow('where может быть вызван только в начале');
    });

    it('should throw error when groupBy called before where', () => {
      const builder = query<ID_card>();
      
      expect(() => {
        (builder as any).groupBy('address');
      }).toThrow('groupBy может быть вызван только после where');
    });

    it('should throw error when having called before groupBy', () => {
      const builder = query<ID_card>().where('age', 25);
      
      expect(() => {
        (builder as any).having((group: any) => group.items.length > 0);
      }).toThrow('having может быть вызван только после groupBy');
    });

    it('should throw error when sort called after groupBy before having', () => {
      const builder = query<ID_card>().where('age', 25).groupBy('address');
      
      expect(() => {
        (builder as any).sort('name');
      }).toThrow('sort может быть вызван после where, having или в начале');
    });

    it('should throw error when where called after groupBy', () => {
      const builder = query<ID_card>().where('age', 25).groupBy('address');
      
      expect(() => {
        (builder as any).where('name', 'John');
      }).toThrow('where может быть вызван только в начале');
    });

    it('should throw error when groupBy called after having', () => {
      const builder = query<ID_card>()
        .where('age', 25)
        .groupBy('address')
        .having(group => group.items.length > 0);
      
      expect(() => {
        (builder as any).groupBy('name');
      }).toThrow('groupBy может быть вызван только после where');
    });
  });

  describe('Интеграционные тесты', () => {
    it('should handle complex query with all operations', () => {
      const result = query<ID_card>()
        .where('age', 25)
        .where('address', 'NY')
        .groupBy('name')
        .having(group => group.items.length === 1)
        .sort('id')
        .build()(testData);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty result set', () => {
      const result = query<ID_card>()
        .where('age', 100)
        .groupBy('address')
        .having(group => group.items.length > 0)
        .sort('name')
        .build()(testData);

      expect(result).toHaveLength(0);
    });

    it('should handle query with only where and sort', () => {
      const result = query<ID_card>()
        .where('address', 'NY')
        .sort('age')
        .build()(testData);

      expect(result).toHaveLength(3);
      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(25);
      expect(result[2].age).toBe(30);
    });

    it('should handle query with only sort', () => {
      const result = query<ID_card>()
        .sort('age')
        .build()(testData);

      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(25);
      expect(result[2].age).toBe(30);
      expect(result[3].age).toBe(30);
      expect(result[4].age).toBe(35);
    });
  });
});