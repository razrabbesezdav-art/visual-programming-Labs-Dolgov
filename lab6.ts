export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
}

export type PickedByType<T, U> = Pick<T, {
    [P in keyof T]: T[P] extends U ? P : never;
}[keyof T]>;

export type EventHandlers<T> = {
  [P in keyof T as `on${Capitalize<string & P>}`]: (event: T[P]) => void;
};
