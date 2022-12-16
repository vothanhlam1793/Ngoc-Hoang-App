<template>
  <div>
    <button @click="logout()">Logout</button>
    <button @click="show()">Show</button>
    <button @click="getData()">Get data</button>
    <h1>Hello Nuxters! 👋</h1>
    <p>
      This page is rendered on the <strong>{{ rendering }}</strong>
    </p>
    <p v-if="rendering === 'server'">
      First load or hard refresh is done on server side.
    </p>
    <p v-if="rendering === 'client'">Navigation is done on client side.</p>
    <ul>
      <li>Refresh the page for server side rendering.</li>
      <li>Click the links to see client side rendering.</li>
    </ul>

    <NuxtLink to="/about">About Page</NuxtLink>
  </div>
</template>
<script>
export default {
  middleware: 'autoLogin',
  async asyncData() {
    return {
      rendering: process.server ? 'server' : 'client'
    }
  },
  methods: {
    async logout(){
      console.log("Log out");
      this.$nuxt.$loading.start()
      await this.$auth.logout();
    },
    async show(){
      console.log(this.$auth);
      console.log(this.$auth.$storage.getCookies());
    },
    async getData(){
      this.$store.dispatch('todos/get_data');
    }
  }
}
</script>
