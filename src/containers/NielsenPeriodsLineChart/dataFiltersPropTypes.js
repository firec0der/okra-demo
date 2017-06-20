import PropTypes from 'prop-types';

export default {
  nielsenAppliers: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
    applicableForBrands: PropTypes.arrayOf(PropTypes.number).isRequired,
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
    applicableForBrands: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  nielsenLevels: PropTypes.shape({
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
    applicableForBrands: PropTypes.arrayOf(PropTypes.number).isRequired,
  })
};
