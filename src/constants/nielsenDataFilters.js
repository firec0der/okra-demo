// Filter names. Names must be singular nouns.
export const NIELSEN_LEVEL_FILTER = 'level';
export const NIELSEN_MANUFACTURER_FILTER = 'manufacturers';
export const NIELSEN_CHANNEL_FILTER = 'channel';
export const NIELSEN_AREA_FILTER = 'areas';
export const NIELSEN_BRAND_FILTER = 'brands';
export const NIELSEN_APPLIER_FILTER = 'applier';
export const NIELSEN_GENRE_FILTER = 'genre';
export const NIELSEN_PACKAGING_FILTER = 'packaging';

export const NIELSEN_DATA_FILTERS = {
  [NIELSEN_LEVEL_FILTER]: {
    key: 'levelId',
    label: 'Level',
    multi: false,
    propKey: 'nielsenLevels'
  },
  [NIELSEN_MANUFACTURER_FILTER]: {
    key: 'manufacturerId',
    label: 'Manufacturers',
    multi: false,
    propKey: 'nielsenManufacturers'
  },
  [NIELSEN_CHANNEL_FILTER]: {
    key: 'channelId',
    label: 'Channel',
    multi: false,
    propKey: 'nielsenChannels'
  },
  [NIELSEN_AREA_FILTER]: {
    key: 'areaIds',
    label: 'Areas',
    multi: true,
    propKey: 'nielsenAreas'
  },
  [NIELSEN_BRAND_FILTER]: {
    key: 'brandIds',
    label: 'Brands',
    multi: true,
    propKey: 'nielsenBrands'
  },
  [NIELSEN_APPLIER_FILTER]: {
    key: 'applierId',
    label: 'Applier',
    multi: false,
    propKey: 'nielsenAppliers'
  },
  [NIELSEN_GENRE_FILTER]: {
    key: 'genreId',
    label: 'Genre',
    multi: false,
    propKey: 'nielsenGenres'
  },
  [NIELSEN_PACKAGING_FILTER]: {
    key: 'packagingId',
    label: 'Packaging',
    multi: false,
    propKey: 'nielsenPackagings'
  }
};
