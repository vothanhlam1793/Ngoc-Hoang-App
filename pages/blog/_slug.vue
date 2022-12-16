<template>
    <article>
        <nuxt-content :document="article" />
        <p>Post last updated: {{ article.updatedAt }}</p>
    </article>
</template>
<script>
  export default {
    async asyncData({ $content, params }) {
        console.log($content);
      const article = await $content('articles', params.slug).fetch()

      return { article }
    }
  }
</script>