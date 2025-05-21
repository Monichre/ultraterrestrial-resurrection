
function toCamelCaseWithUse(inputString: string): string {
    // Step 1: Normalize the input string by removing leading/trailing spaces
    const normalizedStr = inputString.trim();

    // Step 2: Use regex to split the string into words based on spaces, underscores, or hyphens
    const words: string[] = normalizedStr.split(/[\s_-]+/);

    // Step 3: Ensure the first word is 'use'
    if (words.length === 0 || (words.length > 0 && words[0].toLowerCase() !== 'use')) {
        words.unshift('use');
    } else {
        // If the first word is 'use' in a different case, standardize it to lowercase 'use'
        words[0] = 'use';
    }

    // Step 4: Convert to camelCase
    let camelCase = words[0].toLowerCase(); // 'use'
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        if (word.length > 0) {
            camelCase += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }

    // Step 5: Ensure that the fourth character is uppercase
    if (camelCase.length > 3) {
        camelCase = camelCase.substring(0, 3) + camelCase.charAt(3).toUpperCase() + camelCase.substring(4);
    }

    return camelCase;
}

module.exports = {
  description: 'Hook Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Hook name',
    },
  ],
  actions: function (data) {
    console.log("🚀 ~ file: index.js:28 ~ data:", data)
    const subDir = 'hooks'
    const basePath = `src/${subDir}`
    // const name = toCamelCaseWithUse
    const actions = [
      {
        type: 'add',
        path: `${basePath}/{{camelCase name}}.tsx`,
        templateFile: './templates/hooks/hook.hbs',
      },
    ]
    return actions
  },
}
  
