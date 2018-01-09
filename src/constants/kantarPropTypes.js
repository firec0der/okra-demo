import PropTypes from 'prop-types';

export default {
  kantarAreas: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  kantarBrands: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  kantarGenres: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  kantarManufacturers: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  kantarPackagings: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  kantarSubcategories: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
};
