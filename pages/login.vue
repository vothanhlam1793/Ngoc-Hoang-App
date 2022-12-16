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
            console.log(this.$auth);
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
  </script>