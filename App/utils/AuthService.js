// import { AsyncStorage } from 'react-native';
// import Auth0Lock from 'react-native-lock';
// import Promise from 'bluebird';

// // import auth client id and domain
// const clientId,
//       domain;

// export const lock = new Auth0Lock(clientId, domain);

// export const getProfile = (lockInstance, accessToken) => {
//   return newPromise((resolve, reject) => {
//     lockInstance.getUserInfo(accessToken, (err, profile) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(profile);
//       }
//     })
//   })
// }

// export const showLock = lockInstance => {
//   lockInstance.show();
// }

// export const setToken = ({ idToken , profile, accessToken }) => {
//   try {
//     AsyncStorage.multiSet(
//       [
//         ["idToken", idToken],
//         ["profile", profile],
//         ["accessToken", accessToken]
//       ]
//     )
//   } catch (err) {
//     throw err;
//   }
// }

// export const removeToken = () => {
//   try {
//     AsyncStorage.multiRemove(
//       [
//         ["idToken", idToken],
//         ["profile", profile],
//         ["accessToken", accessToken]
//       ]
//     )
//   } catch (err) {
//     throw err;
//   }
// }

// export const getProfileInfo = () => {
//   const profile = AsyncStorage.getItem('profile');
//   return profile ? JSON.parse(profile) : {}
// }

// export const getAllTokens = () => {
//   const token = AsyncStorage.getItem('idToken');
//   const profile = getProfileInfo();
//   const accessToken = AsyncStorage.getItem('accessToken');
//   if (idToken && profile && accessToken) {
//     return { idToken, profile, accessToken };
//   } else {
//     return null;
//   }
// }

// export const getIdToken = () => {
//   AsyncStorage.getItem('idToken');
// }
