<script>
  import PageForm from "./PageForm.svelte";

  let currentPage = {};
  export let pages = [];
  export let params = {};

  $: {
    if (pages && pages.length && params.pageId) {
      // it's UPDATE mode
      currentPage = pages.find((x) => x._id === params.pageId);
    }
  }
</script>

<style>

</style>

<main>
  <PageForm on:create on:update model={currentPage} {pages} {params} />
</main>
