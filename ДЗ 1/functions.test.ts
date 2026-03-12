import { describe, it, expect } from 'vitest';

import {createUser, createBook, calcArea, getStatusColor, capitalizeFirstLetter, trimAndMaybeUppercase, getFirstElement, findById} from './functions';

describe('TypeScript Tasks Training', () => {

  it('Задание 1: createUser - должен создавать объект пользователя', () => {
    const user = createUser(1, 'Alice', true, 'alice@example.com');
    expect(user).toEqual({ id: 1, name: 'Alice', isActive: true, email: 'alice@example.com' });
    
    const userDefault = createUser(2, 'Bob');
    expect(userDefault.isActive).toBe(false);
    expect(userDefault.email).toBeUndefined();
  });

  it('Задание 2: createBook - должен возвращать объект книги', () => {
    const book = { title: '1984', author: 'George Orwell', genre: 'fiction' as const };
    expect(createBook(book)).toEqual(book);
  });

  it('Задание 3: calcArea - должен правильно считать площадь', () => {
    expect(calcArea('square', 5)).toBe(25);
    expect(calcArea('circle', 10)).toBeCloseTo(314.159, 2);
  });

  it('Задание 4: getStatusColor - должен возвращать правильный цвет', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('inactive')).toBe('yellow');
    expect(getStatusColor('new')).toBe('red');
  });

  it('Задание 5: stringFormater - форматирование строк', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('')).toBe('');
    
    expect(trimAndMaybeUppercase('  test  ', true)).toBe('TEST');
    expect(trimAndMaybeUppercase('  test  ', false)).toBe('test');
  });

  it('Задание 6: getFirstElement - работа с Generic', () => {
    expect(getFirstElement([10, 20, 30])).toBe(10);
    expect(getFirstElement(['a', 'b'])).toBe('a');
    expect(getFirstElement([])).toBeUndefined();
  });

  it('Задание 7: findById - поиск по ID в массиве объектов', () => {
    const items = [{ id: 1, val: 'A' }, { id: 2, val: 'B' }];
    expect(findById(items, 2)).toEqual({ id: 2, val: 'B' });
    expect(findById(items, 99)).toBeUndefined();
  });

});