// Filter names. Names must be singular nouns.
export const LEVEL_FILTER = 'level';
export const MANUFACTURER_FILTER = 'manufacturers';
export const CHANNEL_FILTER = 'channel';
export const AREA_FILTER = 'areas';
export const BRAND_FILTER = 'brands';
export const APPLIER_FILTER = 'applier';
export const GENRE_FILTER = 'genre';
export const PACKAGING_FILTER = 'packaging';

export const DATA_FILTERS_CONFIG = {
  [LEVEL_FILTER]: {
    key: 'levelId',
    label: 'Level',
    multi: false,
    nielsenPropKey: 'nielsenLevels',
    kantarPropKey: 'kantarLevels'
  },
  [MANUFACTURER_FILTER]: {
    key: 'manufacturerId',
    label: 'Manufacturers',
    multi: false,
    nielsenPropKey: 'nielsenManufacturers'
  },
  [CHANNEL_FILTER]: {
    key: 'channelId',
    label: 'Channel',
    multi: false,
    nielsenPropKey: 'nielsenChannels'
  },
  [AREA_FILTER]: {
    key: 'areaIds',
    label: 'Areas',
    multi: true,
    nielsenPropKey: 'nielsenAreas',
    kantarPropKey: 'kantarAreas'
  },
  [BRAND_FILTER]: {
    key: 'brandIds',
    label: 'Brands',
    multi: true,
    nielsenPropKey: 'nielsenBrands',
    kantarPropKey: 'kantarBrands'
  },
  [APPLIER_FILTER]: {
    key: 'applierId',
    label: 'Applier',
    multi: false,
    nielsenPropKey: 'nielsenAppliers'
  },
  [GENRE_FILTER]: {
    key: 'genreId',
    label: 'Genre',
    multi: false,
    nielsenPropKey: 'nielsenGenres',
    genrePropKey: 'kantarGenres'
  },
  [PACKAGING_FILTER]: {
    key: 'packagingId',
    label: 'Packaging',
    multi: false,
    nielsenPropKey: 'nielsenPackagings',
    kantarPropKey: 'kantarPackagings'
  }
};
