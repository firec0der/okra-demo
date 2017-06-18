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
  [NIELSEN_LEVEL_FILTER]: { stateKey: 'levelId', multi: false }, // single choice
  [NIELSEN_MANUFACTURER_FILTER]: { stateKey: 'manufacturerIds', multi: true }, // multiple choice
  [NIELSEN_CHANNEL_FILTER]: { stateKey: 'channelIds', multi: false }, // single choice ?
  [NIELSEN_AREA_FILTER]: { stateKey: 'areaIds', multi: true }, // multiple choice
  [NIELSEN_BRAND_FILTER]: { stateKey: 'brandIds', multi: true }, // multiple choice
  [NIELSEN_APPLIER_FILTER]: { stateKey: 'applierIds', multi: false }, // single choice
  [NIELSEN_GENRE_FILTER]: { stateKey: 'genreId', multi: false },  // single choice
  [NIELSEN_PACKAGING_FILTER]: { stateKey: 'packagingId', multi: false } // single choice
};
