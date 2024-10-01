export type StripPrefix<T extends string, K extends string> = T extends `${K}${infer V}` ? V : T;

export type Maybe<T> = T | undefined;
