<script>
  import { Route, router } from "tinro";
  import { onMount } from "svelte";
  import { getCookie } from "./utils/cookie";
  import NotFound from "./containers/NotFound.svelte";
  import request, {
    makeApiUrl,
    makeGetReq,
    makeAuthUrl,
  } from "./utils/request";
  import Sidebar from "./components/Sidebar.svelte";
  import ApplicationAdministration from "./containers/Applications/ApplicationAdministration.svelte";

  import { loadApplications } from "./actions/application";
  import { getUserInfo } from "./actions/auth";
  import SidePanel from "./containers/Shared/SidePanel.svelte";
  import PageAdministration from "./containers/Page/PageAdministration.svelte";
  import ArticleAdministration from "./containers/Articles/ArticleAdministration.svelte";

  let user = {
    isLoggedIn: false,
  };

  let pages = [];
  let articles = [];
  let applications = [];
  let sidePanelRef;

  onMount(async () => {
    await loadUserInfo();
    const response = await loadApplications();
    applications = response.payload;
  });

  const loadUserInfo = async () => {
    try {
      const response = await getUserInfo();
      user = response.payload;
    } catch (error) {
      window.location.href = "/";
    }
  };

  let theme = localStorage.getItem("theme") || "light";

  const onThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    theme = newTheme;
  };

  const onCreate = ({ detail }) => {
    switch (detail.type) {
      case "application":
        applications = [detail.payload, ...applications];
        router.goto("/blog/applications/" + detail.payload._id + "/pages");
        break;
      case "page":
        pages = [detail.payload, ...pages];
        router.goto(
          `/blog/applications/${detail.payload.application}/pages/${detail.payload._id}`
        );
        break;
      case "article":
        articles = [detail.payload, ...articles];
        router.goto(
          `/blog/applications/${detail.params.applicationId}/pages/${detail.payload.page}/articles/${detail.payload._id}`
        );
        break;
    }
  };

  const onUpdate = ({ detail }) => {
    switch (detail.type) {
      case "application":
        applications = applications.map((x) =>
          x._id === detail.payload._id ? detail.payload : x
        );
        break;
      case "page":
        pages = pages.map((x) =>
          x._id === detail.payload._id ? detail.payload : x
        );
        break;
      case "article":
        if (detail.params.pageId !== detail.payload.page) {
          router.goto(
            `/blog/applications/${detail.params.applicationId}/pages/${detail.payload.page}/articles/${detail.payload._id}`
          );
        } else {
          articles = articles.map((x) =>
            x._id === detail.payload._id ? detail.payload : x
          );
        }
        break;
    }
  };

  const onRemove = ({ detail }) => {
    switch (detail.type) {
      case "application":
        applications = applications.filter((x) => x._id !== detail.payload._id);
        router.goto("/blog/applications");
        break;
      case "page":
        pages = pages.filter((x) => x._id !== detail.payload._id);
        router.goto(
          "/blog/applications/" + detail.payload.application + "/pages"
        );
        break;
    }
  };
  const onSetPages = ({ detail }) => {
    pages = detail.pages;
  };
  const onSetArticles = ({ detail }) => {
    articles = detail.articles;
  };
</script>

<style>
  @media only screen and (max-width: 1024px) {
    .base {
      margin: 0 10px;
    }
  }
  :global(a.active) {
    color: var(--primary) !important;
  }
  :global(*) {
    margin: 0px;
    padding: 0px;
    font-family: sans-serif;
  }
  :global(html),
  :global(body) {
    height: 100%;
  }
  :global(#root) {
    min-height: 100%;
    background-color: var(--background);
  }
  :global(.theme-light) {
    --primary: #d21e2b;
    --text: #333;
    --background: #fff;
    --edge: #e2dddd;
    --neutral: #9c9999;
    --link: #1a73e8;
    --sidebar-background: #fafafa;
    --sidebar-after-background: #ececec94;
  }
  :global(.theme-dark) {
    --primary: #d21e2b;
    --text: #fff;
    --background: #0e0e0e;
    --edge: #44444494;
    --neutral: #585858;
    --link: #1a73e8;
    --sidebar-background: #131313;
    --sidebar-after-background: #21212194;
  }
  :global(.content-layout) {
    display: grid;
    margin-left: 70px;
    position: relative;
    grid-template-columns: 250px auto;
    padding: 0px 0px 0px 0px;
  }
  :global(.form) {
    padding: 15px;
    display: grid;
    grid-row-gap: 20px;
  }
  :global(.form-header) {
    font-weight: 500;
    color: var(--text);
    letter-spacing: 0.03rem;
    font-size: 1rem;
    padding: 28px 20px;
    text-transform: uppercase;
    background: var(--sidebar-background);
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>
<div id="root" class="theme-{theme}">
  <div class="sidebar-layout">
    <Sidebar on:themeChange={onThemeChange} {theme} />
    <Route>
      <Route path="/blog" redirect="/blog/applications" />
      <div class="content-layout">
        <Route path="/blog/applications" let:params>
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <ApplicationAdministration
            {params}
            {applications}
            on:create={onCreate} />
        </Route>
        <!-- <Route path="/blog/applications/:applicationId" let:params>
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <PageAdministration {applications} {params} on:update={onUpdate} />
        </Route> -->
        <Route path="/blog/applications/update/:applicationId" let:params>
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <ApplicationAdministration
            {params}
            {applications}
            on:update={onUpdate} />
        </Route>

        <!-- Pages -->

        <Route path="/blog/applications/:applicationId/pages" let:params>
          <!-- bind:this={sidePanelRef} -->
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <PageAdministration {pages} {params} on:create={onCreate} />
        </Route>

        <!-- Update Page -->

        <Route
          path="/blog/applications/:applicationId/pages/:pageId/update"
          let:params>
          <!-- bind:this={sidePanelRef} -->
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <PageAdministration {pages} {params} on:update={onUpdate} />
        </Route>

        <Route
          path="/blog/applications/:applicationId/pages/:pageId"
          let:params>
          <!-- bind:this={sidePanelRef} -->
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <div>
            <ArticleAdministration
              on:create={onCreate}
              {pages}
              {articles}
              {params} />
          </div>
        </Route>

        <!-- Articles -->

        <Route
          path="/blog/applications/:applicationId/pages/:pageId/articles/:articleId"
          let:params>
          <!-- bind:this={sidePanelRef} -->
          <SidePanel
            {pages}
            {articles}
            on:setPages={onSetPages}
            on:setArticles={onSetArticles}
            on:remove={onRemove}
            {applications}
            {params} />
          <div>
            <ArticleAdministration
              on:update={onUpdate}
              {pages}
              {articles}
              {params} />
          </div>
        </Route>

        <!-- <Route path="/blog/applications/:applicationId/blog/:noteId" let:params>
          We bind here sidePanel ref because just at this route sidePanel can get updated content
          <SidePanel {pages}
            bind:this={sidePanelRef}
            on:remove={onRemove}
            {applications}
            {params} />
          <ArticlesForm {params} on:update={onUpdate} />
        </Route> -->
      </div>
      <Route fallback>
        <NotFound />
      </Route>
    </Route>
  </div>
</div>
