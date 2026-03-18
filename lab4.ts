type Transform<T> = (items: T[]) => T[];

type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

type GroupBy<T> = <K extends keyof T>(key: K) => (items: T[]) => Group<T, K>[];

type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export type ID_card ={
    id: number;
    name: string;
    address: string;
    age: number;
    phoneNumber: string;
}

export type queryStep = "start"| "where" | "groupBy" | "having" | "sort";

export interface QueryState <Step extends queryStep = "start">{
    readonly step:  Step;
    readonly steps: ReadonlyArray<(data: any) => any>;
}

export type placeWhere<currentStep extends queryStep> =
    currentStep extends 'start' ? 'where' : never;

export type placeGroupBy<currentStep extends queryStep> =
    currentStep extends 'where' ? 'groupBy' : never;

export type placeHaving<currentStep extends queryStep> =
    currentStep extends 'groupBy' ? 'having' : never;

export type placeSort<currentStep extends queryStep> =
    currentStep extends 'having' | 'where' | 'start'  ? 'sort': never;
    
export const where: Where<ID_card> =
    (key, value) =>
    (data) =>
        data.filter((item) => item[key] === value);

export const sort: Sort<ID_card> =
    (key) =>
    (data) =>
        [...data].sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (av < bv) return -1;
            if (av > bv) return 1;
            return 0;
        });

export const groupBy: GroupBy<ID_card> =
    (key) =>
    (data) =>
        Object.values(
            data.reduce((acc, item) => {
                const k = item[key] as unknown as string;
                (acc[k] ??= { key: item[key], items: [] }).items.push(item);
                return acc;
            }, {} as Record<string, Group<ID_card, typeof key>>),
        );

export const having: Having<ID_card> =
    (predicate) =>
    (groups) =>
    groups.filter(predicate);

export function query<T>(...steps: Function[]){
    return (input: T[]): any => { return steps.reduce((data, step) => step(data), input); };
}

