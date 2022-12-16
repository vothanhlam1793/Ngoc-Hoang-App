import _get from 'lodash/get';

export default ({ store, redirect }) => {
    const authenticateUser = _get(store, 'state.auth', null);
    console.log(authenticateUser);
    if (authenticateUser.loggedIn) {
        redirect('/');
    } else {
        redirect('/login');
    }
};