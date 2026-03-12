<script lang="ts">
  import { theme } from "$lib/theme"
</script>

<button
  onclick={() => theme.toggle()}
  class="fixed top-4 right-4 z-50 theme-toggle"
  class:theme-toggle--toggled={$theme}
  aria-label="toggle dark mode">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    width="1.5em"
    height="1.5em"
    fill="currentColor"
    class="theme-toggle__inner-moon"
    viewBox="0 0 32 32">
    <path d="M27.5 11.5v-7h-7L16 0l-4.5 4.5h-7v7L0 16l4.5 4.5v7h7L16 32l4.5-4.5h7v-7L32 16l-4.5-4.5zM16 25.4a9.39 9.39 0 1 1 0-18.8 9.39 9.39 0 1 1 0 18.8z" />
    <circle cx="16" cy="16" r="8.1" />
  </svg>
</button>

<style>
  .theme-toggle {
    --theme-toggle__inner-moon--duration: 500ms;
    background: none;
    border: none;
    cursor: pointer;
    color: black;
    padding: 0;
  }

  :global(.dark) .theme-toggle {
    color: white;
  }

  .theme-toggle__inner-moon path {
    transform-origin: center;
    transition: transform var(--theme-toggle__inner-moon--duration) cubic-bezier(0, 0, 0.15, 1.25);
  }

  .theme-toggle__inner-moon circle {
    transition: transform calc(var(--theme-toggle__inner-moon--duration) / 1.5) cubic-bezier(0.4, 0, 0.2, 1);
  }

  .theme-toggle--toggled .theme-toggle__inner-moon path {
    transform: rotate(180deg);
  }

  .theme-toggle--toggled .theme-toggle__inner-moon circle {
    transform: translate3d(15%, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle :global(*) {
      transition: none !important;
    }
  }
</style>
