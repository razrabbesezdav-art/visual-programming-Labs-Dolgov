type Transform<T> = (items: T[]) => T[];

type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

type GroupBy<T> = <K extends keyof T>(key: K) => (items: T[]) => Group<T, K>[];

type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

type ID_card ={
    id: number;
    name: string;
    address: string;
    age: number;
    phoneNumber: string;
}
const where: Where<ID_card> =
    (key, value) =>
    (data) =>
        data.filter((item) => item[key] === value);

const sort: Sort<ID_card> =
    (key) =>
    (data) =>
        [...data].sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (av < bv) return -1;
            if (av > bv) return 1;
            return 0;
        });

const groupBy: GroupBy<ID_card> =
    (key) =>
    (data) =>
        Object.values(
            data.reduce((acc, item) => {
                const k = item[key] as unknown as string;
                (acc[k] ??= { key: item[key], items: [] }).items.push(item);
                return acc;
            }, {} as Record<string, Group<ID_card, typeof key>>),
        );

const having: Having<ID_card> =
 (predicate) =>
 (groups) =>
 groups.filter(predicate);

