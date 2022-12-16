import _get from 'lodash/get';

export default ({ store, redirect }) => {
    const authenticateUser = _get(store, 'state', null);
    console.log("SERVER: ", authenticateUser);
};