export const resourcePath = (path) => {
  if (process.env.NODE_ENV === "development") {
    return path;
  }
  return process.env.PUBLIC_URL + path;
}
