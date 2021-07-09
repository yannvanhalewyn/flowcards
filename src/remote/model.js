import { selector } from "recoil";
import { identity } from "ramda";

/*
 * Uses the projects "homepage" attribute from package.json ("/flowcards") in
 * order to support Github Pages root URL being on ...github.io/flowcards/<asset>
 */
export const resourcePath = (path) => process.env.PUBLIC_URL + path;

export const createRemoteLoader = (loader) =>
  selector({
    key: loader.key,
    default: {},
    get: async (foo, bar) => {
      const response = await fetch(resourcePath(loader.endpoint));
      const data = await response.json();

      if (response.ok) {
        return (loader.parseResponse || identity)(data);
      }
      return loader.default;
    },
  });
