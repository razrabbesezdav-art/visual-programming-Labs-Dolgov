type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
}

type PickedByType<T, U> = Pick<T, {
    [P in keyof T]: T[P] extends U ? P : never;
}[keyof T]>;

