<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import { active, router } from "tinro";
  import request, {
    makeApiUrl,
    makeGetReq,
    makePostReq,
  } from "../../utils/request";
  import { timeSince } from "../../utils/date";
  import { loadApplicationPages, removePage } from "../../actions/page";
  import RemoveirectoryIcon from "../../components/icons/RemoveApplicationIcon.svelte";
  import CreateApplicationIcon from "../../components/icons/CreateApplicationIcon.svelte";
  import CreateArticleIcon from "../../components/icons/CreateArticleIcon.svelte";
  import UpdateApplicationIcon from "../../components/icons/UpdateApplicationIcon.svelte";
  import { article } from "../../actions";
  import { removeApplication } from "../../actions/application";
  import { removeArticle, loadPageArticles } from "../../actions/article";
  import { isNotEmpty } from "../../utils/validators";

  export let params;
  export let pages = [];
  export let articles = [];
  export let applications = [];
  const dispatch = createEventDispatcher();

  $: if (params) {
    if (params.applicationId) {
      loadPages();
      if (params.pageId) {
        loadArticles();
      }
    }
  }

  const loadPages = async () => {
    const res = await loadApplicationPages({
      applicationId: params.applicationId,
    });
    dispatch("setPages", { pages: res.payload });
  };
  const loadArticles = async () => {
    const res = await loadPageArticles({ pageId: params.pageId });
    dispatch("setArticles", { articles: res.payload });
  };
  export const updateArticle = (payload) => {
    articles = articles.map((n) => (n._id === payload._id ? payload : n));
  };
  export const addArticle = (payload) => {
    articles = [payload, ...articles];
  };
  const onArticleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Remove article?")) {
      const res = await removeArticle({ articleId: e.target.value });
      let newArticles = articles.filter((n) => n._id !== e.target.value);
      if (e.target.value === params.articleId) {
        router.goto(
          `/blog/applications/${params.applicationId}/pages/${params.pageId}`
        );
      } else {
        dispatch("setArticles", { articles: newArticles });
      }
    }
  };
  const onApplicationChange = (e) => {
    router.goto(
      "/blog/applications" +
        (e.target.value ? "/" + e.target.value + "/pages" : "")
    );
  };

  const onPageChange = (e) => {
    router.goto(
      `/blog/applications/${params.applicationId}/pages${
        e.target.value ? "/" + e.target.value : ""
      }`
    );
  };

  const handlePageRemove = async () => {
    if (
      window.confirm(
        "Remove page? All articles within this page will be removed too."
      )
    ) {
      const res = await removePage({
        pageId: params.pageId,
      });
      dispatch("remove", res);
    }
  };
  const handleApplicationRemove = async () => {
    if (
      window.confirm(
        "Remove application? All pages and articles within them will be removed too."
      )
    ) {
      const res = await removeApplication({
        applicationId: params.applicationId,
      });
      dispatch("remove", res);
    }
  };
</script>

<style>
  main {
    color: var(--text);
    min-height: 100vh;
    background-color: var(--sidebar-after-background);
  }
  .header {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    justify-content: space-between;
  }

  select {
    border: none;
    background: transparent;
    color: var(--text);
    outline: none;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.03rem;
    padding: 15px 5px 15px 0px;
    width: 100%;
    position: relative;
    right: 4px;
    cursor: pointer;
  }
  select option {
    padding: 10px;
    font-size: 14px;
    color: black;
  }
  .article-list {
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 10px;
  }
  .article-list li {
    list-style: none;
  }
  :global(.article-list .active) {
    background: var(--sidebar-background);
  }
  .article-list a {
    display: block;
    padding: 10px;
    text-decoration: none;
  }
  .article-list .article-title {
    font-weight: 500;
    letter-spacing: 0.03rem;
    margin-bottom: 10px;
    color: var(--text);
    max-width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5rem;
  }
  .article-list .article-description {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: var(--neutral);
    font-size: 0.8rem;
  }
  button {
    color: var(--neutral);
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
    position: absolute;
    right: 0;
    bottom: -5px;
    z-index: 2;
    padding: 5px;
    padding-right: 0;
  }
  .neutral-hover > * {
    color: var(--neutral);
    transition: color 0.3s ease;
  }
  .neutral-hover > *:hover {
    color: var(--text);
  }
  .header-control {
    position: static;
    padding: 0px;
  }
  .header-control-link {
    font-size: 0.8rem;
    text-decoration: none;
  }
  .header-control,
  .header-control-link {
    margin-right: 10px;
  }
  button:hover {
    color: var(--text);
  }
  .relative {
    position: relative;
  }
  .article-control {
    z-index: 9;
  }

  .header-controls {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .cursor-default {
    cursor: default;
  }
</style>

<main>
  <div class="header">

    <!-- Select App -->
    <select bind:value={params.applicationId} on:input={onApplicationChange}>
      <option value="">Select Application</option>
      {#each applications as application}
        <option value={application._id}>{application.name}</option>
      {/each}
    </select>

    <div class="neutral-hover header-controls">
      {#if params.applicationId}
        <a
          href={'/blog/applications'}
          class="header-control-link"
          title="Create Application">
          <!-- <CreateApplicationIcon /> -->
          Create
        </a>
        <a
          class="header-control-link"
          href="/blog/applications/update/{params.applicationId}"
          title="Update Application">
          <!-- <UpdateApplicationIcon /> -->
          Update
        </a>
        <button
          on:click={handleApplicationRemove}
          class="header-control"
          title="Remove Application">
          <!-- <RemoveirectoryIcon /> -->
          Remove
        </button>
        <!-- <CreateArticleIcon /> -->
        <a
          href={'/blog/applications/' + params.applicationId + '/pages'}
          class="header-control-link"
          title="Create Page">
          New Page
        </a>
      {/if}
    </div>
    {#if !params.applicationId}
      <span />
    {/if}
  </div>

  <!-- Pages Section -->
  {#if params.applicationId}
    <div class="header">
      <select bind:value={params.pageId} on:input={onPageChange}>
        <option value="">Select Page</option>
        {#each pages as page, i (page._id)}
          <option value={page._id}>{page.title}</option>
        {/each}
      </select>
      <div class="neutral-hover header-controls">
        {#if params.applicationId}
          {#if params.pageId}
            <a
              class="header-control-link"
              href="/blog/applications/{params.applicationId}/pages/{params.pageId}/update"
              title="Update Page">
              Update
            </a>
            <button
              on:click={handlePageRemove}
              class="header-control"
              title="Remove Page">
              Remove
            </button>
            <a
              class="header-control-link"
              href="/blog/applications/{params.applicationId}/pages/{params.pageId}"
              title="Create Article">
              New Article
            </a>
          {/if}
        {/if}
      </div>
    </div>
  {:else if applications && !applications.length}
    <ul class="article-list">
      <li>
        <a href=" #" tinro-ignore class="cursor-default">
          <p class="article-title">There's no applications yet.</p>
          <div class="article-description">
            <p>Creeate application using the form on the right.</p>
          </div>
        </a>
      </li>
    </ul>
  {/if}

  {#if !params.applicationId && applications.length}
    <ul class="article-list">
      <li>
        <a href=" #" class="cursor-default">
          <p class="article-title">Choose Application to view blog</p>
          <div class="article-description">
            <p>You are step away of your blog content</p>
          </div>
        </a>
      </li>
    </ul>
  {/if}
  {#if params.pageId}
    <ul class="article-list">
      {#if articles && articles.length}
        {#each articles as article, i (article._id)}
          <li>
            <a
              use:active
              href="/blog/applications/{params.applicationId}/pages/{params.pageId}/articles/{article._id}">
              <p class="article-title">{article.title}</p>
              <div class="article-description">
                <p>{timeSince(new Date(article.createdAt))}</p>
                <p class="relative">
                  <button
                    class="article-control"
                    value={article._id}
                    on:click={onArticleRemove}>
                    Remove
                  </button>
                </p>
              </div>
            </a>
          </li>
        {/each}
      {/if}
      {#if articles && !articles.length}
        <li>
          <a href=" #" tinro-ignore class="cursor-default">
            <p class="article-title">There's no articles yet</p>
            <div class="article-description">
              <p>Creeate article using the form on the right</p>
            </div>
          </a>
        </li>
      {/if}
    </ul>
  {/if}
  {#if params.applicationId && pages.length && !params.pageId}
    <ul class="article-list">
      <li>
        <a href=" #" tinro-ignore class="cursor-default">
          <p class="article-title">Choose Page to view articles</p>
          <div class="article-description">
            <p>You are step away of your articles</p>
          </div>
        </a>
      </li>
    </ul>
  {/if}

  {#if params.applicationId && !pages.length && !params.pageId}
    <ul class="article-list">
      <li>
        <a href=" #" tinro-ignore class="cursor-default">
          <p class="article-title">There's no Pages yet</p>
          <div class="article-description">
            <p>Create page using the form on the right</p>
          </div>
        </a>
      </li>
    </ul>
  {/if}
</main>
