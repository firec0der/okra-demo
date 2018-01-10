// imports from vendors
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// imports from layouts
import PageLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';
import SignInPage from '../pages/SignInPage/SignInPage';

// import Q1Page from '../pages/Q1Page/Q1Page';

import { fetchMetrics } from '../modules/metrics';
import { fetchBrands } from '../modules/brands';
import { fetchManufacturers } from '../modules/manufacturers';

import { fetchKantarBrands } from '../modules/kantar/kantarBrands';
import { fetchKantarAreas } from '../modules/kantar/kantarAreas';
import { fetchKantarGenres } from '../modules/kantar/kantarGenres';
import { fetchKantarManufacturers } from '../modules/kantar/kantarManufacturers';
import { fetchKantarPackagings } from '../modules/kantar/kantarPackagings';
import { fetchKantarSubcategories } from '../modules/kantar/kantarSubcategories';

import { fetchNielsenAppliers } from '../modules/nielsen/nielsenAppliers';
import { fetchNielsenAreas } from '../modules/nielsen/nielsenAreas';
import { fetchNielsenBrands } from '../modules/nielsen/nielsenBrands';
import { fetchNielsenGenres } from '../modules/nielsen/nielsenGenres';
import { fetchNielsenChannels } from '../modules/nielsen/nielsenChannels';
import { fetchNielsenManufacturers } from '../modules/nielsen/nielsenManufacturers';
import { fetchNielsenPackagings } from '../modules/nielsen/nielsenPackagings';
import { fetchNielsenSubcategories } from '../modules/nielsen/nielsenSubcategories';

import { fetchNwbBrands } from '../modules/nwb/nwbBrands';
import { fetchNwbGenres } from '../modules/nwb/nwbGenres';
import { fetchNwbManufacturers } from '../modules/nwb/nwbManufacturers';
import { fetchNwbSubcategories } from '../modules/nwb/nwbSubcategories';

export const onHomeEnter = ({ dispatch, getState }) => (nextState, replace, next) => {
  const { auth } = getState();

  if (!auth.isAuthenticated) {
    replace({ pathname: '/sign-in' });
    return next();
  }

  dispatch(fetchMetrics());
  dispatch(fetchBrands());
  dispatch(fetchManufacturers());

  dispatch(fetchKantarAreas());
  dispatch(fetchKantarBrands());
  dispatch(fetchKantarGenres());
  dispatch(fetchKantarManufacturers());
  dispatch(fetchKantarPackagings());
  dispatch(fetchKantarSubcategories());

  dispatch(fetchNielsenAppliers());
  dispatch(fetchNielsenAreas());
  dispatch(fetchNielsenBrands());
  dispatch(fetchNielsenChannels());
  dispatch(fetchNielsenGenres());
  dispatch(fetchNielsenManufacturers());
  dispatch(fetchNielsenPackagings());
  dispatch(fetchNielsenSubcategories());

  dispatch(fetchNwbBrands());
  dispatch(fetchNwbGenres());
  dispatch(fetchNwbManufacturers());
  dispatch(fetchNwbSubcategories());

  return next();
};

export const onSignInEnter = ({ getState }) => (nextState, replace, next) => {
  const { auth } = getState();

  if (auth.isAuthenticated) {
    replace({ pathname: '/' });
    return next();
  }

  return next();
};

export default (store) => (
  <Router history={browserHistory}>
    <Route component={PageLayout}>
      <Route path="/" component={HomePage} onEnter={onHomeEnter(store)} />
      <Route path="/sign-in" component={SignInPage} onEnter={onSignInEnter(store)} />
    </Route>
  </Router>
);
