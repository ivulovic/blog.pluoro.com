<script>
  import ArticleForm from "./ArticleForm.svelte";

  export let params = {};
  export let pages = [];
  export let articles = [];
  let currentArticle = {};
  $: {
    if (articles && articles.length && params.articleId) {
      currentArticle = articles.find((x) => x._id === params.articleId);
    }
  }
</script>

<style>

</style>

<main>
  <ArticleForm on:create on:update model={currentArticle} {pages} {params} />
</main>
