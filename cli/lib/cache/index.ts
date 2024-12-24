const currentDir = Deno.realPathSync(Deno.cwd());
const CACHE_PATH = `${currentDir}/cache`;
const OUTPUT_PATH = `${currentDir}/output`;
const DEBUG_LOG_PATH = `${currentDir}/debug.log`;

const ensureDir = (path: string) => {
  // Make sure the cache directory exists
  try {
    Deno.mkdirSync(path);
  } catch (_err) {
    // Directory already exists
  }
};
ensureDir(CACHE_PATH);

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
  ensureDir(CACHE_PATH);
  Deno.writeFileSync(
    `${CACHE_PATH}/${key}.json`,
    new TextEncoder().encode(JSON.stringify(data)),
  );
};

export const clearCache = async (): Promise<void> => {
  try {
    await Deno.remove(CACHE_PATH, { recursive: true });
    await Deno.remove(OUTPUT_PATH, { recursive: true });
    await Deno.remove(DEBUG_LOG_PATH);
    console.log(
      "Cache, output directories, and debug.log file deleted successfully.",
    );
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};
