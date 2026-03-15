type Transform<T> = (items: T[]) => T[];

type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};