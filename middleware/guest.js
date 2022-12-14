import _get from 'lodash/get';

export default ({ store, redirect }) => {
    const authenticateUser = _get(store, 'state.authenticate', null);
    if (authenticateUser) {
        redirect('/login');
    } else {
        redirect('/black');
    }
};