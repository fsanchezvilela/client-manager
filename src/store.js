import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
// Reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

const firebaseConfig = {
  apiKey: 'AIzaSyAap1Nef61wY4PZUmDtUcMmvO0m9p0EEcI',
  authDomain: 'reactclientpanel-584ca.firebaseapp.com',
  databaseURL: 'https://reactclientpanel-584ca.firebaseio.com',
  projectId: 'reactclientpanel-584ca',
  storageBucket: 'reactclientpanel-584ca.appspot.com',
  messagingSenderId: '122152811214'
};
// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);

//Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

//Cheack for settings in localStorage
if (localStorage.getItem('settings') == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // Set to a localStorage . wrap in json string ya que el local storage funciona con strings literales
  localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

// Create initial state / tranformar el objeto de settings string parseando a JSON
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) };

//Create Store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  composeEnhancers(reactReduxFirebase(firebase))
);

export default store;
