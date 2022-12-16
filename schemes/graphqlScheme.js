import { gql } from 'graphql-tag'

import { LocalScheme } from '~auth/runtime'

const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String, $password: String) {
    authenticate: authenticateUserWithPassword(username: $username, password: $password){
        token
        item {
            name
        }
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation LogOutMutation {
    unauthenticate: unauthenticateUser {
        success
    }
  }
`

export const USER_DETAILS_QUERY = gql`
    query UserDetailsQuery {
        authenticatedUser {
            id
            name
            phone
            email
        }
    }
`

export default class GraphQLScheme extends LocalScheme {
  // TODO: Override relevant LocalScheme methods
    async login(credentials, { reset = true } = {}) {
        const {
            apolloProvider: { defaultClient: apolloClient },
            $apolloHelpers,
        } = this.$auth.ctx.app
    
        // Ditch any leftover local tokens before attempting to log in
        if (reset) {
            this.$auth.reset({ resetInterceptor: false })
        }
    
        // console.log(LOGIN_MUTATION);
        // console.log(credentials);
        // Make login request
        const response = await apolloClient
        .mutate({
            mutation: LOGIN_MUTATION,
            variables: credentials,
        })
        .then(({ data }) => data);

        var token = response.authenticate.token;
        // Update our cookie token
        this.token.set(token)
    
        // Set our graphql-token so subsequent graphql request are authenticated
        await $apolloHelpers.onLogin(token)
    
        // Fetch user
        await this.fetchUser() // We will define this function next
    
        return token
    }

    fetchUser() {
        const {
          apolloProvider: { defaultClient: apolloClient },
        } = this.$auth.ctx.app
      
        // Token is required but not available
        if (!this.check().valid) {
          return
        }
        // Try to fetch user
        return apolloClient
          .query({
            query: USER_DETAILS_QUERY,
          })
          .then(({ data }) => {
            if (!data.authenticatedUser) {
              const error = new Error(`User Data response not resolved`)
              return Promise.reject(error)
            }
            // Set the auth user
            this.$auth.setUser(data.authenticatedUser)
      
            return data.authenticatedUser
          })
          .catch((error) => {
            this.$auth.callOnError(error, { method: 'fetchUser' })
            return Promise.reject(error)
          })
    }

    async logout() {
      console.log("logout server");
        const {
          apolloProvider: { defaultClient: apolloClient },
          $apolloHelpers,
        } = this.$auth.ctx.app
      
        await apolloClient
          .mutate({
            mutation: LOGOUT_MUTATION,
          })
          .catch(() => {
            // Handle errors
          })
      
        // Reset regardless
        $apolloHelpers.onLogout()
        return this.$auth.reset({ resetInterceptor: false })
    }

    initializeRequestInterceptor() {
        // Instead of initializing axios interceptors, Do nothing
        // Since we are not using axios
    }

    reset() {
        this.$auth.setUser(false)
        this.token.reset()
    }
}