import { Store, Module, ModuleOptions } from "vuex";

export default function Persistence(...modules: string[]): any {
    const restore = (module: string, store: any) => {
        const state = JSON.parse(JSON.stringify(store.state));
        const value = window.localStorage.getItem(`hoobs:gui:${module}`);
        const stored = value ? JSON.parse(value) : undefined;

        if (stored) {
            state[module] = stored;
            store.replaceState(state);
        }
    };

    return (store: Store<{ [key: string]: any }>): void => {
        const register = Store.prototype.registerModule;

        Store.prototype.registerModule = function registerModule(path: string | string[], raw: Module<unknown, any>, options: ModuleOptions | undefined) {
            register.apply(this, [typeof path === "string" ? [path] : path, raw, options]);

            const module = typeof path === "string" ? path : path.join("/");

            if (modules.indexOf(module) !== -1) restore(module, store);
        };

        modules.forEach((module) => restore(module, store));

        store.subscribe((_mutation: any, state: { [key: string]: any }) => {
            modules.forEach((module: string) => {
                if (module in state && state[module]) window.localStorage.setItem(`hoobs:gui:${module}`, JSON.stringify(state[module]));
            });
        });
    };
}