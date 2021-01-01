// Renaming map
// For renaming keys in badly made APIs
const renameMap = new Map<string, string>();
renameMap.set("guildAvatar", "avatarUrl");
renameMap.set("ID", "Id");
renameMap.set("URL", "Url");

// String suffixes
const stringSuffixes = ["_str", "Str", "String"];

// Coercing map
// For coercing null values into a default value.
const coercingMap = new Map<string, any>();
coercingMap.set("games", []);

const convertKey = (key: string): string => {
  let newKey = key;

  // Rename based on the renaming map
  renameMap.forEach((val, key) => {
    if (newKey.includes(key)) newKey = newKey.replace(key, val);
  });

  // A disgusting way of converting to camelCase
  // https://hisk.io/javascript-snake-to-camel/
  newKey = newKey.replace(/(_[a-z])/g, (group) =>
    group.toUpperCase().replace("_", "")
  );

  // A disgusting way of replacing the non-string version with their string counterpart.
  for (const stringSuffix of stringSuffixes) {
    if (newKey.endsWith(stringSuffix)) {
      newKey = newKey.slice(0, -stringSuffix.length);
      break;
    }
  }

  return newKey;
};

const convertKeys = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(convertKeys);
  }

  return Object.fromEntries(
    Object.entries(data)
      .filter(([a]) => {
        // Remove entries where a string varient exists of the key.
        for (const stringSuffix of stringSuffixes) {
          if (Object.keys(data).includes(a + stringSuffix)) return false;
        }

        return true;
      })
      .map(([key, value]) => {
        // Convert the key to an acceptable value.
        const newKey = convertKey(key);

        if (typeof value === "object" && value !== null)
          return [newKey, convertKeys(value)];

        return [newKey, value];
      })
  );
};

export { convertKeys, convertKey };
