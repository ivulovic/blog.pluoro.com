<script>
  export let label;
</script>

<style>
  .button {
    border: none;
    padding: 0.931rem 0.6rem;
    box-shadow: inset 0 0 0 1px var(--edge);
    border-radius: 0px;
    cursor: pointer;
    color: var(--text);
    background: transparent;
    transition: background 0.3s ease;
  }
  .button:hover {
    background: var(--edge);
  }
</style>

<button class="button" on:click>{label}</button>
