export function toSnakeCase(str) {
  return str
    .toLowerCase() // Convert the string to lowercase
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}