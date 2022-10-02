import type * as Kit from '@sveltejs/kit';

type RouteParams = {  }
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureParentData<T> = T extends null | undefined ? {} : T;
type PageServerParentData = EnsureParentData<import('../$types.js').LayoutServerData>;
type PageParentData = EnsureParentData<import('../$types.js').LayoutData>;

export type PageServerLoad<OutputData extends OutputDataShape<PageServerParentData> = OutputDataShape<PageServerParentData>> = Kit.ServerLoad<RouteParams, PageServerParentData, OutputData>;
export type PageServerLoadEvent = Parameters<PageServerLoad>[0];
export type ActionData = Kit.AwaitedActions<typeof import('./proxy+page.server.js').actions>;
export type PageServerData = Kit.AwaitedProperties<Awaited<ReturnType<typeof import('./proxy+page.server.js').load>>>;
export type PageData = Omit<PageParentData, keyof PageServerData> & PageServerData;
export type Action = Kit.Action<RouteParams>
export type Actions = Kit.Actions<RouteParams>
export type RequestEvent = Kit.RequestEvent<RouteParams>;