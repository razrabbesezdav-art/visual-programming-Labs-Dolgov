import { expectType } from 'ts-expect';
import { describe, it, expect, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers} from './lab6';

describe('DeepReadonly', () => {
    it('Должна делать поля вложенных объектов readonly', () => {
        interface Nested {
        id: number;
        user: {
            name: string;
            address: {
                city: string;
                street: string;
            };
        };
        tags: string[];
        }

        type ReadonlyNested = DeepReadonly<Nested>;
    
        const obj: ReadonlyNested = {
            id: 1,
            user: {
                name: 'John',
                address: {
                    city: 'New York',
                    street: 'Broadway'
                }
            },
            tags: ['a', 'b', 'c']
        };

        expectType<number>(obj.id);
        expectType<{
            readonly name: string;
            readonly address: {
            readonly city: string;
            readonly street: string;
            };
        }>(obj.user);
        expectType<string>(obj.user.name);
        expectType<string>(obj.user.address.city);
        expectType<readonly string[]>(obj.tags);   
    });

});

describe('PickedByType', () => {
  interface TestObject {
    name: string;
    email: string;
    description: string;
    
    id: number;
    age: number;
    score: number;
    
    isActive: boolean;
    isDeleted: boolean;
    
    tags: string[];
    scores: number[];
    matrix: number[][];
    
  }

  it('Должен находить свойства поля string', () => {
    type StringProps = PickedByType<TestObject, string>;
    
    expectType<keyof StringProps>('name');
    expectType<keyof StringProps>('email');
    expectType<keyof StringProps>('description');

  });

  it('Должен находить только поля number', () => {
    type NumberProps = PickedByType<TestObject, number>;
    
    expectType<keyof NumberProps>('id');
    expectType<keyof NumberProps>('age');
    expectType<keyof NumberProps>('score');
  });

});

describe('EventHandlers', () => {
    interface MouseEvent {
    x: number;
    y: number;
    button: number;
    ctrlKey: boolean;
    shiftKey: boolean;
  }

  interface KeyboardEvent {
    key: string;
    code: string;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
  }

  interface FormEvent {
    target: HTMLFormElement;
    currentTarget: HTMLFormElement;
    preventDefault: () => void;
    stopPropagation: () => void;
  }

  interface FocusEvent {
    target: HTMLElement;
    relatedTarget: HTMLElement | null;
  }

  interface DragEvent {
    x: number;
    y: number;
    dataTransfer: DataTransfer | null;
  }

  interface TouchEvent {
    touches: Array<{ x: number; y: number }>;
    changedTouches: Array<{ x: number; y: number }>;
  }

  interface CustomEvent<T = any> {
    detail: T;
    timestamp: number;
  }

  interface AppEvents {
    click: MouseEvent;
    dblclick: MouseEvent;
    mousedown: MouseEvent;
    mouseup: MouseEvent;
    mousemove: MouseEvent;
    
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
    keypress: KeyboardEvent;
    
    submit: FormEvent;
    reset: FormEvent;
    change: FormEvent;
    input: FormEvent;
    invalid: FormEvent;
    
    focus: FocusEvent;
    blur: FocusEvent;
    focusin: FocusEvent;
    focusout: FocusEvent;
    
    dragstart: DragEvent;
    drag: DragEvent;
    dragend: DragEvent;
    dragenter: DragEvent;
    dragleave: DragEvent;
    dragover: DragEvent;
    drop: DragEvent;
    
    touchstart: TouchEvent;
    touchmove: TouchEvent;
    touchend: TouchEvent;
    touchcancel: TouchEvent;
    
    'custom:event': CustomEvent;
    'before-unload': CustomEvent<{ reason: string }>;
    'visibility_change': CustomEvent<{ isVisible: boolean }>;
    '3d-touch': MouseEvent;
    '2d-context': MouseEvent;
    
    '123event': CustomEvent;
    'event456': CustomEvent;
    
    'mouse_enter': MouseEvent;
    'mouse_leave': MouseEvent;
  }

  it('Должно корректно преобразовывать простые названия событий.', () => {
    type Handlers = EventHandlers<AppEvents>;
    
    expectType<keyof Handlers>('onClick');
    expectType<keyof Handlers>('onDblclick');
    expectType<keyof Handlers>('onMousedown');
    expectType<keyof Handlers>('onMouseup');
    expectType<keyof Handlers>('onMousemove');
    
    expectType<keyof Handlers>('onKeydown');
    expectType<keyof Handlers>('onKeyup');
    expectType<keyof Handlers>('onKeypress');
    
    expectType<keyof Handlers>('onSubmit');
    expectType<keyof Handlers>('onReset');
    expectType<keyof Handlers>('onChange');
    expectType<keyof Handlers>('onInput');
    expectType<keyof Handlers>('onInvalid');
    
    expectType<keyof Handlers>('onFocus');
    expectType<keyof Handlers>('onBlur');
    expectType<keyof Handlers>('onFocusin');
    expectType<keyof Handlers>('onFocusout');
    
  });
});