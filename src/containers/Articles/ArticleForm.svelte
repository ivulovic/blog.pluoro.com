<script>
  import {
    loadArticleInfo,
    createArticle,
    updateArticle,
  } from "../../actions/article";
  import Editor from "../../components/Editor.svelte";
  import { createEventDispatcher } from "svelte";
  import Input from "../../components/Input.svelte";
  import Button from "../../components/Button.svelte";

  export let model;
  export let pages;
  export let params = {};

  const dispatch = createEventDispatcher();
  const quillDefaultValue = { html: "", text: "" };

  let formData = {
    path: "",
    title: "",
    description: "",
    content: "",
    public: false,
    page: params.pageId,
  };

  let intialEditorContent = quillDefaultValue;

  const handleTextChange = ({ detail }) => {
    formData.content = detail.html;
  };

  $: {
    if (model) {
      formData = model;
      intialEditorContent.html = model.content;
    }
    if (params) {
      formData.page = params.pageId;
    }
  }

  const onSubmit = async () => {
    const {
      path,
      title,
      description,
      content,
      public: isPublic,
      page,
    } = formData;
    const obj = {
      path,
      title,
      description,
      content,
      public: isPublic,
      page,
    };
    if (params.articleId) {
      obj.articleId = params.articleId;
      const res = await updateArticle(obj);
      res.params = params;
      dispatch("update", res);
    } else {
      const res = await createArticle(obj);
      res.params = params;
      dispatch("create", res);
    }
  };

  function detectControlS(event) {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      onSubmit();
      event.preventDefault();
    }
  }

  const handleInputChange = (e) => {
    formData[e.target.id] = e.target.value;
  };
</script>

<style>
  select {
    border: none;
    background: transparent;
    color: var(--text);
    outline: none;
    font-weight: 500;
    font-size: 1rem;
    letter-spacing: 0.03rem;
    box-shadow: inset 0 0 0 1px var(--edge);
    border-radius: 0px;
    padding: 0.806rem 0.6rem;
  }
  select option {
    padding: 10px;
    font-size: 14px;
    color: black;
  }
  .checkbox {
    box-shadow: inset 0 0 0 1px var(--edge);
    border-radius: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 0.6rem;
  }
  .checkbox input {
    margin-right: 10px;
  }
  .checkbox label {
    color: var(--text);
    font-size: 1rem;
    flex: 1;
    padding: 0.837rem 0px;
  }
</style>

<h1 class="form-header">{params.articleId ? 'Update' : 'Create'} article</h1>
<div class="form">
  <Input
    on:keydown={detectControlS}
    on:input={handleInputChange}
    value={formData.path}
    id="path"
    label="Path" />

  <Input
    on:keydown={detectControlS}
    on:input={handleInputChange}
    value={formData.title}
    id="title"
    label="Title" />

  <Input
    on:keydown={detectControlS}
    on:input={handleInputChange}
    value={formData.description}
    id="description"
    label="Description" />

  <div class="checkbox">
    <input type="checkbox" bind:checked={formData.public} id="public" />
    <label for="public">Public</label>
  </div>

  {#if params.articleId}
    <select
      value={formData.page}
      on:input={(e) => (formData.page = e.target.value)}>
      {#if pages}
        {#each pages as page}
          <option value={page._id}>{page.title}</option>
        {/each}
      {/if}
    </select>
  {/if}

  <Editor
    on:save={onSubmit}
    on:keydown={detectControlS}
    on:text-change={handleTextChange}
    {intialEditorContent} />

  <Button
    on:click={onSubmit}
    label={`${params.articleId ? 'Update' : 'Create'} Article`} />
</div>
