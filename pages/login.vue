<template>
    <div>
      <form @submit.prevent="userLogin">
        <div>
          <label>Username</label>
          <input type="text" v-model="login.username" />
        </div>
        <div>
          <label>Password</label>
          <input type="text" v-model="login.password" />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  const credentials = { username: 'examlple', password: 'asrkpvg7' }

  export default {
    middleware: 'auth',
    auth: 'guest',
    data() {
      return {
        login: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      async userLogin() {
        credentials.username = this.login.username;
        credentials.password = this.login.password;
        try {
          let response = await this.$auth.loginWith('graphql', credentials)
          console.log(response)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
  </script>