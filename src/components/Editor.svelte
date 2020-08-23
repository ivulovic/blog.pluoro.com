<script>
  import { quill } from "svelte-quill";
  import {
    onMount,
    createEventDispatcher,
    afterUpdate,
    onDestroy,
  } from "svelte";
  const dispatch = createEventDispatcher();
  export let intialEditorContent;

  $: if (intialEditorContent.html) {
    initiateEditor();
  }

  function initiateEditor() {
    const qlEditorContentRef = document.querySelector(".ql-editor");
    if (qlEditorContentRef) {
      qlEditorContentRef.innerHTML = intialEditorContent.html;
    }
    // else {
    //   setTimeout(() => {
    //     initiateEditor();
    //   }, 0);
    // }
  }

  let options = {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        [{ size: [] }],
        [{ font: [] }],
        [{ color: [] }],
        [{ background: [] }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "+1" },
          { indent: "-1" },
        ],
        ["bold", "italic", "underline", "strike", "blockquote"],
        ["code-block", "link", "image", "video"],
      ],
    },
    placeholder: "Content",
  };
</script>

<style>
  :global(.editor) {
    color: var(--text);
    min-height: 250px;
    border-color: transparent !important;
  }
  :global(.ql-editor) {
    min-height: 250px;
  }
  :global(.ql-container.ql-snow) {
    border: none !important;
    outline: none !important;
    font-size: unset;
  }

  :global(main .ql-toolbar.ql-snow),
  :global(.ql-blank::before) {
    border-color: transparent;
    color: var(--neutral) !important;
  }
  :global(.ql-toolbar) {
    background: var(--sidebar-after-background);
  }
  :global(.ql-container) {
    height: unset !important;
  }
</style>

<main>
  <div class="editor" on:keydown use:quill={options} on:text-change />
</main>
