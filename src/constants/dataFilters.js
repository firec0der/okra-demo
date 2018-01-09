// Filter names. Names must be singular nouns.
export const MANUFACTURER_FILTER = 'manufacturers';
export const CHANNEL_FILTER = 'channel';
export const AREA_FILTER = 'areas';
export const BRAND_FILTER = 'brands';
export const APPLIER_FILTER = 'applier';
export const GENRE_FILTER = 'genre';
export const PACKAGING_FILTER = 'packaging';
export const SUBCATEGORY_FILTER = 'subcategory';

export const DATA_FILTERS_CONFIG = {
  [MANUFACTURER_FILTER]: {
    key: 'manufacturerId',
    label: 'Manufacturer',
    multi: false,
    nielsenPropKey: 'nielsenManufacturers',
    nwbPropKey: 'nwbManufacturers',
    kantarPropKey: 'kantarManufacturers',
  },
  [CHANNEL_FILTER]: {
    key: 'channelId',
    label: 'Channel',
    multi: false,
    nielsenPropKey: 'nielsenChannels',
  },
  [AREA_FILTER]: {
    key: 'areaIds',
    label: 'Areas',
    multi: true,
    nielsenPropKey: 'nielsenAreas',
    kantarPropKey: 'kantarAreas',
  },
  [BRAND_FILTER]: {
    key: 'brandIds',
    label: 'Brands',
    multi: true,
    nielsenPropKey: 'nielsenBrands',
    kantarPropKey: 'kantarBrands',
    nwbPropKey: 'nwbBrands',
  },
  [APPLIER_FILTER]: {
    key: 'applierId',
    label: 'Applier',
    multi: false,
    nielsenPropKey: 'nielsenAppliers',
  },
  [GENRE_FILTER]: {
    key: 'genreId',
    label: 'Genre',
    multi: false,
    nielsenPropKey: 'nielsenGenres',
    kantarPropKey: 'kantarGenres',
    nwbPropKey: 'nwbGenres',
  },
  [PACKAGING_FILTER]: {
    key: 'packagingId',
    label: 'Packaging',
    multi: false,
    nielsenPropKey: 'nielsenPackagings',
    kantarPropKey: 'kantarPackagings',
  },
  [SUBCATEGORY_FILTER]: {
    key: 'subcategoryId',
    label: 'Subcategory',
    multi: false,
    nielsenPropKey: 'nielsenSubcategories',
    kantarPropKey: 'kantarSubcategories',
    nwbPropKey: 'nwbSubcategories',
  }
};
