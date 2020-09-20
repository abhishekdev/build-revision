module.exports = {
    singleQuote: true,
    tabWidth: 4,
    overrides: [
        {
            files: ['package.json', 'package-lock.json', '*.yml'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ['package-lock.json'],
            options: {
                printWidth: 200,
            },
        },
    ],
};
