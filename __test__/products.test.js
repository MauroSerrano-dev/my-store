import { PRODUCTS_TYPES_ORDERED } from '../src/consts';

describe('Product Types Tests', () => {
  test('Each product type should have a unique id', () => {
    const ids = PRODUCTS_TYPES_ORDERED.map(type => type.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('Each variant should be unique within its type', () => {
    PRODUCTS_TYPES_ORDERED.forEach(type => {
      const variantIds = type.variants.map(variant => variant.id);
      const uniqueVariantIds = new Set(variantIds);
      expect(uniqueVariantIds.size).toBe(variantIds.length);
    });
  });

  test('Each type should have all necessary fields', () => {
    PRODUCTS_TYPES_ORDERED.forEach(type => {
      expect(type).toHaveProperty('id');
      expect(type).toHaveProperty('family_id');
      expect(type).toHaveProperty('color');
      expect(type).toHaveProperty('providers');
      expect(type).toHaveProperty('blueprint_ids');
      expect(type).toHaveProperty('icon');
      expect(type).toHaveProperty('inicial_tags');
      expect(type).toHaveProperty('key_features');
      expect(type).toHaveProperty('care_instructions');
      expect(type).toHaveProperty('metrics');
      expect(type).toHaveProperty('sizes');
      expect(type).toHaveProperty('colors');
      expect(type).toHaveProperty('variants');
    });
  });

  test('Each type should have a unique icon', () => {
    const icons = PRODUCTS_TYPES_ORDERED.map(type => type.icon);
    const uniqueIcons = new Set(icons);
    expect(uniqueIcons.size).toBe(icons.length);
  });

  test('Each variant should have a valid id_printify within its type', () => {
    let hasError = false; // Variável de flag para indicar se ocorreu algum erro

    PRODUCTS_TYPES_ORDERED.forEach(type => {
      const idPrintifyMap = new Map(); // Map para rastrear os id_printify usados

      type.variants.forEach(variant => {
        // Verifica se o campo id_printify existe
        expect(variant).toHaveProperty('id_printify');

        // Se id_printify for uma number, verifica se é único
        if (typeof variant.id_printify === 'number') {
          if (idPrintifyMap.has(variant.id_printify))
            console.error(`Invalid id_printify value "${variant.id_printify}" in variant "${variant.id}" in type "${type.id}"`);
          expect(idPrintifyMap.has(variant.id_printify)).toBeFalsy(); // Verifica se já foi usado
          idPrintifyMap.set(variant.id_printify, true);
        }

        // Se id_printify for um objeto, verifica cada valor
        else if (typeof variant.id_printify === 'object') {
          Object.values(variant.id_printify).reduce((acc, id) => acc.includes(id) ? acc : [...acc, id], []).forEach(id => {

            if (idPrintifyMap.has(id))
              console.error(`Invalid id_printify value "${id}" in variant "${variant.id}" in type "${type.id}"`);

            expect(typeof id).toBe('number');
            expect(idPrintifyMap.has(id)).toBeFalsy(); // Verifica se já foi usado
            idPrintifyMap.set(id, true);
          });
        }
        else {
          // Se id_printify não for number nem objeto, emite um console de erro
          console.error(`Invalid id_printify format for variant "${variant.id}" in type "${type.id}"`);
        }
      });
    });

    // Se ocorreu algum erro, faz com que o teste falhe
    if (hasError) {
      throw new Error('Test failed due to id_printify format errors');
    }
  });
});
