/*
 * Uses the projects "homepage" attribute from package.json ("/flowcards") in
 * order to support Github Pages root URL being on ...github.io/flowcards/<asset>
 */
export const resourcePath = (path) => process.env.PUBLIC_URL + path;
