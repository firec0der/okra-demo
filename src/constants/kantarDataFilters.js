// Filter names. Names must be singular nouns.
export const KANTAR_LEVEL_FILTER = 'level';
export const KANTAR_AREA_FILTER = 'areas';
export const KANTAR_BRAND_FILTER = 'brands';
export const KANTAR_GENRE_FILTER = 'genre';
export const KANTAR_PACKAGING_FILTER = 'packaging';

export const KANTAR_DATA_FILTERS_CONFIG = {
  [KANTAR_LEVEL_FILTER]: {
    key: 'levelId',
    label: 'Level',
    multi: false,
    propKey: 'kantarLevels'
  },
  [KANTAR_AREA_FILTER]: {
    key: 'areaIds',
    label: 'Areas',
    multi: true,
    propKey: 'kantarAreas'
  },
  [KANTAR_BRAND_FILTER]: {
    key: 'brandIds',
    label: 'Brands',
    multi: true,
    propKey: 'kantarBrands'
  },
  [KANTAR_GENRE_FILTER]: {
    key: 'genreId',
    label: 'Genre',
    multi: false,
    propKey: 'kantarGenres'
  },
  [KANTAR_PACKAGING_FILTER]: {
    key: 'packagingId',
    label: 'Packaging',
    multi: false,
    propKey: 'kantarPackagings'
  }
};
