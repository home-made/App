import Immutable from 'seamless-immutable';

export const types = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILTURE: 'LOGIN_FAILURE'
}

const initialState = Immutable({
  isAuthenticated: false,
  isFetching: false,
  authStatus: 'logged out',
  error: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST: {
      return initialState;
    }
    case types.LOGIN_SUCCESS: {

    }
  }
}