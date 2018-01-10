import PropTypes from 'prop-types';

export default {
  nielsenAppliers: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenAreas: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenBrands: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenChannels: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenGenres: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenManufacturers: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenPackagings: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nielsenSubcategories: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
};
