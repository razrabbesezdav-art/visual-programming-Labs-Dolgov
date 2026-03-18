export type Transform<T> = (items: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupBy<T> = <K extends keyof T>(key: K) => (items: T[]) => Group<T, K>[];

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export interface ID_card {
  id: number;
  name: string;
  address: string;
  age: number;
  phoneNumber: string;
}

export type QueryPhase = 'initial' | 'where' | 'groupBy' | 'having' | 'sort';

export interface QueryState<Phase extends QueryPhase = 'initial'> {
  readonly phase: Phase;
  readonly steps: ReadonlyArray<(data: any) => any>;
}

export type ValidateWhere<CurrentPhase extends QueryPhase> = 
  CurrentPhase extends 'initial' ? 'where' : never;

export type ValidateGroupBy<CurrentPhase extends QueryPhase> = 
  CurrentPhase extends 'where' ? 'groupBy' : never;

export type ValidateHaving<CurrentPhase extends QueryPhase> = 
  CurrentPhase extends 'groupBy' ? 'having' : never;

export type ValidateSort<CurrentPhase extends QueryPhase> = 
  CurrentPhase extends 'having' | 'where' | 'initial' ? 'sort' : never;

export const where = <T, K extends keyof T>(key: K, value: T[K]): Transform<T> => {
  return (data) => data.filter((item) => item[key] === value);
};

export const sort = <T, K extends keyof T>(key: K): Transform<T> => {
  return (data) =>
    [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
};

export const groupBy = <T, K extends keyof T>(key: K) => {
  return (data: T[]): Group<T, K>[] =>
    Object.values(
      data.reduce((acc, item) => {
        const k = String(item[key]);
        if (!acc[k]) {
          acc[k] = { key: item[key], items: [] };
        }
        acc[k].items.push(item);
        return acc;
      }, {} as Record<string, Group<T, K>>)
    );
};

export const having = <T, K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
): GroupTransform<T, K> => {
  return (groups) => groups.filter(predicate);
};

export class QueryBuilder<T, Phase extends QueryPhase = 'initial'> {
  constructor(private state: QueryState<Phase>) {}

  private isPhase<ExpectedPhase extends QueryPhase>(
    phase: QueryPhase,
    expected: ExpectedPhase
  ): phase is ExpectedPhase {
    return phase === expected;
  }

  where<K extends keyof T>(key: K, value: T[K]): QueryBuilder<T, 'where'> {
    if (!this.isPhase(this.state.phase, 'initial')) {
      throw new Error('where может быть вызван только в начале');
    }

    const whereFn = where<T, K>(key, value);
    const newSteps = [...this.state.steps, whereFn];
    
    return new QueryBuilder<T, 'where'>({
      phase: 'where',
      steps: newSteps
    });
  }

  groupBy<K extends keyof T>(key: K): QueryBuilder<T, 'groupBy'> {
    if (!this.isPhase(this.state.phase, 'where')) {
      throw new Error('groupBy может быть вызван только после where');
    }

    const groupByFn = groupBy<T, K>(key);
    const newSteps = [...this.state.steps, groupByFn];
    
    return new QueryBuilder<T, 'groupBy'>({
      phase: 'groupBy',
      steps: newSteps
    });
  }

  having<K extends keyof T>(
    predicate: (group: Group<T, K>) => boolean
  ): QueryBuilder<T, 'having'> {
    if (!this.isPhase(this.state.phase, 'groupBy')) {
      throw new Error('having может быть вызван только после groupBy');
    }

    const havingFn = having<T, K>(predicate);
    const newSteps = [...this.state.steps, havingFn];
    
    return new QueryBuilder<T, 'having'>({
      phase: 'having',
      steps: newSteps
    });
  }

  sort<K extends keyof T>(key: K): QueryBuilder<T, 'sort'> {
    if (!['initial', 'where', 'having'].includes(this.state.phase)) {
      throw new Error('sort может быть вызван после where, having или в начале');
    }

    const sortFn = sort<T, K>(key);
    const newSteps = [...this.state.steps, sortFn];
    
    return new QueryBuilder<T, 'sort'>({
      phase: 'sort',
      steps: newSteps
    });
  }

  build(): (data: T[]) => any[] {
    return (input: T[]) => {
      return this.state.steps.reduce((data, step) => step(data), input);
    };
  }
}

export function query<T>(): QueryBuilder<T, 'initial'> {
  return new QueryBuilder<T, 'initial'>({
    phase: 'initial',
    steps: []
  });
}

export type ValidQuerySequence<T> = 
  | QueryBuilder<T, 'initial'>
  | QueryBuilder<T, 'where'>
  | QueryBuilder<T, 'groupBy'>
  | QueryBuilder<T, 'having'>
  | QueryBuilder<T, 'sort'>;