<script>
  import Logo from "./Logo.svelte";
  import BlogIcon from "./icons/BlogIcon.svelte";
  import NoteIcon from "./icons/NoteIcon.svelte";
  import { createEventDispatcher } from "svelte";
  import DarkThemeIcon from "./icons/DarkThemeIcon.svelte";
  import LightThemeIcon from "./icons/LightThemeIcon.svelte";
  function checkIsActive(path) {
    return window.location.pathname.includes(path) ? "active" : "";
  }
  export let theme;
  const dispatch = createEventDispatcher();
  const toggleTheme = () => dispatch("themeChange");
</script>

<style>
  aside {
    height: 100%;
    display: flex;
    padding: 10px 5px;
    position: fixed;
    box-sizing: border-box;
    flex-direction: column;
    background-color: var(--sidebar-background);
    justify-content: space-between;
    width: 70px;
  }
  nav,
  footer {
    padding: 0px 0px;
  }
  nav ul {
    display: grid;
    grid-template-columns: 1fr;
  }
  nav li,
  button {
    list-style: none;
    display: inline-block;
  }
  nav a,
  button {
    display: block;
    text-decoration: none;
    color: var(--neutral);
    font-weight: 500;
    padding: 10px 0px;
    letter-spacing: 0.03rem;
    border-radius: 25px;
    transition: color 0.3s ease;
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    margin: 0px;
    text-align: center;

    width: 100%;
  }
  nav a:hover,
  button:hover {
    color: var(--text);
  }
  nav a.active {
    color: var(--text) !important;
  }
  footer {
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
  }
</style>

<aside>
  <Logo />

  <nav>
    <ul>
      <li>
        <a href="/blog" class={checkIsActive('/blog')} tinro-ignore>
          <BlogIcon />
        </a>
      </li>
      <li>
        <a href="/notes" class={checkIsActive('/notes')} tinro-ignore>
          <NoteIcon />
        </a>
      </li>
    </ul>
  </nav>

  <footer>
    <button on:click={toggleTheme}>
      {#if theme === 'dark'}
        <LightThemeIcon />
      {:else}
        <DarkThemeIcon />
      {/if}
    </button>
  </footer>
</aside>
