<script>
  import { createEventDispatcher } from "svelte";
  import {
    createApplication,
    updateApplication,
  } from "../../actions/application";
  import Input from "../../components/Input.svelte";
  import Button from "../../components/Button.svelte";

  export let name = "";
  export let params = {};

  $: if (name) {
    applicationName = name;
  }

  let applicationName = "";

  const dispatch = createEventDispatcher();

  const handleCreate = async () => {
    const res = await createApplication({ name: applicationName });
    dispatch("create", res);
  };
  const handleUpdate = async () => {
    const res = await updateApplication({
      name: applicationName,
      applicationId: params.applicationId,
    });
    dispatch("update", res);
  };

  const handleInputChange = (e) => {
    applicationName = e.target.value;
  };
  function detectControlS(event) {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
      onSubmit();
      event.preventDefault();
    }
  }
  function onSubmit() {
    if (params.applicationId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  }
</script>

<h1 class="form-header">
  {params.applicationId ? 'Update' : 'Create'} application
</h1>
<div class="form">
  <Input
    on:keydown={detectControlS}
    on:input={handleInputChange}
    value={applicationName}
    id="name"
    label="Application Host" />

  <Button
    on:click={onSubmit}
    label={`${params.applicationId ? 'Update' : 'Create'} Application`} />
</div>
