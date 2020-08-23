<script>
  import { createEventDispatcher } from "svelte";
  import { createPage, updatePage } from "../../actions/page";
  import Input from "../../components/Input.svelte";
  import Button from "../../components/Button.svelte";

  export let model;
  export let params = {};
  export let pages = [];
  let formData = {
    path: "",
    title: "",
    description: "",
    public: false,
    application: params.applicationId,
    parentPage: null,
  };
  $: {
    if (model) {
      formData = model;
    }
    if (params) {
      formData.application = params.applicationId;
    }
  }

  const dispatch = createEventDispatcher();

  const handleCreate = async () => {
    formData.parentPage = formData.parentPage || null;
    const res = await createPage(formData);
    dispatch("create", res);
  };
  const handleUpdate = async () => {
    formData.pageId = params.pageId;
    const {
      path,
      title,
      description,
      public: isPublic,
      application,
      parentPage,
    } = formData;
    const obj = {
      pageId: params.pageId,
      path,
      title,
      description,
      public: isPublic,
      application,
      parentPage: parentPage || null,
    };
    const res = await updatePage(obj);
    dispatch("update", res);
  };

  const handleInputChange = (e) => {
    formData[e.target.id] = e.target.value;
  };
  function detectControlS(event) {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      onSubmit();
      event.preventDefault();
    }
  }
  function onSubmit() {
    if (params.pageId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  }
</script>

<style>
  /* .input {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    color: var(--text);
    padding: 28px 20px;
    font-size: 1rem;
    box-sizing: border-box;
    padding-top: 20px 0px;
  } */
  /* button {
    color: var(--text);
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
  }
  .controls button {
    padding: 5px 10px;
    border: 1px solid var(--edge);
    margin-top: 8px;
  }
  .controls {
    padding: 0px 15px;
  } */

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

<h1 class="form-header">{params.pageId ? 'Update' : 'Create'} page</h1>
<div class="form">
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

  <Input
    on:keydown={detectControlS}
    on:input={handleInputChange}
    value={formData.path}
    id="path"
    label="Path" />

  <select bind:value={formData.parentPage}>
    <option value="">Choose parent Page</option>
    {#each pages.filter((x) => x._id !== params.pageId) as page}
      <option value={page._id}>{page.title}</option>
    {/each}
  </select>

  <div class="checkbox">
    <input type="checkbox" bind:checked={formData.public} id="public" />
    <label for="public">Public</label>
  </div>

  <Button
    on:click={onSubmit}
    label={`${params.pageId ? 'Update' : 'Create'} Page`} />
</div>
