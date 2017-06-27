import PropTypes from 'prop-types';

export default {
  nwbBrands: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nwbGenres: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nwbManufacturers: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
  nwbSubcategories: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    dictionary: PropTypes.object.isRequired,
  }),
};
