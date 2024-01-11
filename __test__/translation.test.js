const fs = require('fs');
const path = require('path');

function checkLocalizationConsistency() {
    const localesPath = path.join(__dirname, '../public/locales');
    const languageDirs = fs.readdirSync(localesPath).filter(dir => fs.statSync(path.join(localesPath, dir)).isDirectory());

    let fileCountMap = {};
    let keysMap = {};

    languageDirs.forEach(lang => {
        const files = fs.readdirSync(path.join(localesPath, lang)).filter(file => file.endsWith('.json'));
        fileCountMap[lang] = files.length;

        files.forEach(file => {
            const filePath = path.join(localesPath, lang, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const keys = Object.keys(content);
            if (!keysMap[file]) keysMap[file] = {};
            keysMap[file][lang] = keys;
        });
    });

    // Verificar se todos os idiomas têm a mesma quantidade de arquivos
    const allSameFileCount = Object.values(fileCountMap).every((val, _, arr) => val === arr[0]);
    if (!allSameFileCount) {
        throw new Error('Inconsistência na quantidade de arquivos entre os idiomas.');
    }

    // Verificar se todos os arquivos têm as mesmas chaves em todos os idiomas
    Object.keys(keysMap).forEach(file => {
        const allLanguages = Object.keys(keysMap[file]);
        const referenceKeys = keysMap[file][allLanguages[0]];

        allLanguages.forEach(lang => {
            const keys = keysMap[file][lang];
            if (keys.length !== referenceKeys.length || !keys.every(key => referenceKeys.includes(key))) {
                throw new Error(`Inconsistência de chaves no arquivo ${file} entre os idiomas.`);
            }
        });
    });

    return 'Todos os idiomas estão consistentes!';
}

// Em seu arquivo de teste Jest, você pode chamar essa função:
describe('Teste de Localização', () => {
    test('Verifica consistência de localização', () => {
        expect(checkLocalizationConsistency()).toBe('Todos os idiomas estão consistentes!');
    });
});