import { PRODUCTS_TYPES } from '../src/consts';

describe('Product Types Tests', () => {
  test('Each product type should have a unique id', () => {
    const ids = PRODUCTS_TYPES.map(type => type.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('Each variant should be unique within its type', () => {
    PRODUCTS_TYPES.forEach(type => {
      const variantIds = type.variants.map(variant => variant.id);
      const uniqueVariantIds = new Set(variantIds);
      expect(uniqueVariantIds.size).toBe(variantIds.length);
    });
  });

  test('Each type should have all necessary fields', () => {
    PRODUCTS_TYPES.forEach(type => {
      expect(type).toHaveProperty('id');
      expect(type).toHaveProperty('family_id');
      expect(type).toHaveProperty('color');
      expect(type).toHaveProperty('providers');
      expect(type).toHaveProperty('blueprint_ids');
      expect(type).toHaveProperty('icon');
      expect(type).toHaveProperty('key_features');
      expect(type).toHaveProperty('care_instructions');
      expect(type).toHaveProperty('metrics');
      expect(type).toHaveProperty('sizes');
      expect(type).toHaveProperty('colors');
      expect(type).toHaveProperty('variants');
    });
  });

  test('Each type should have a unique icon', () => {
    const icons = PRODUCTS_TYPES.map(type => type.icon);
    const uniqueIcons = new Set(icons);
    expect(uniqueIcons.size).toBe(icons.length);
  });
});
