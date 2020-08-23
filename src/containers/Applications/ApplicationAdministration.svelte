<script>
  import ApplicationForm from "./ApplicationForm.svelte";

  export let params = {};
  export let applications = [];
  let currentApplication = {};
  $: {
    if (applications && applications.length && params.applicationId) {
      currentApplication = applications.find(
        (x) => x._id === params.applicationId
      );
    }
  }
</script>

<style>

</style>

<main>
  <ApplicationForm
    on:create
    on:update
    name={currentApplication.name}
    {params} />
</main>
