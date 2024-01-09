import { createContext } from "react";

interface IRouterContext {
  route: string
  setRoute: (_r: string) => void,
}

const Context = createContext<IRouterContext>({
  route: '/',
  setRoute: (_r: string) => { }
});
export default Context;
