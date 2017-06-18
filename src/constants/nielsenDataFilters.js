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
    stateKey: 'levelId',
    label: 'Level',
    multi: false
  },
  [NIELSEN_MANUFACTURER_FILTER]: {
    stateKey: 'manufacturerIds',
    label: 'Manufacturers',
    multi: true
  },
  [NIELSEN_CHANNEL_FILTER]: {
    stateKey: 'channelIds',
    label: 'Channel',
    multi: false // ?
  },
  [NIELSEN_AREA_FILTER]: {
    stateKey: 'areaIds',
    label: 'Areas',
    multi: true
  },
  [NIELSEN_BRAND_FILTER]: {
    stateKey: 'brandIds',
    label: 'Brands',
    multi: true
  },
  [NIELSEN_APPLIER_FILTER]: {
    stateKey: 'applierIds',
    label: 'Applier',
    multi: false
  },
  [NIELSEN_GENRE_FILTER]: {
    stateKey: 'genreId',
    label: 'Genre',
    multi: false
  },
  [NIELSEN_PACKAGING_FILTER]: {
    stateKey: 'packagingId',
    label: 'Packaging',
    multi: false
  }
};
