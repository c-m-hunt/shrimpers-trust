// Current path
const currentDir = Deno.realPathSync(Deno.cwd());
const CACHE_PATH = `${currentDir}/cache`;

// Make sure the cache directory exists
try {
  Deno.mkdirSync(CACHE_PATH);
} catch (_err) {
  // Directory already exists
}

export const getCache = (key: string): null | object => {
  try {
    const data = Deno.readFileSync(`${CACHE_PATH}/${key}.json`);
    const jsonString = new TextDecoder().decode(data);
    return JSON.parse(jsonString);
  } catch (_err) {
    return null;
  }
};

export const setCache = (key: string, data: object): void => {
  Deno.writeFileSync(
    `${CACHE_PATH}/${key}.json`,
    new TextEncoder().encode(JSON.stringify(data)),
  );
};