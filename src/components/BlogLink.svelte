<script>
  import FormattedDate from './FormattedDate.svelte'
  const { url, title, showDate, pubDate } = $props()
</script>

<a href={url}>
  <h6 class="title">{title}</h6>
  {#if showDate}
    <p class="date">
      <FormattedDate date={pubDate} />
    </p>
  {/if}
</a>

<style>
  .title {
    margin: 0;
    color: var(--text-main);
    line-height: 1;
  }

  * {
    text-decoration: none;
    transition: 0.2s ease;
  }

  a {
    display: block;
  }

  .title {
    margin: 0;
    color: var(--text-main);
    line-height: 1;
    position: relative;
    display: inline-block;
  }

  @keyframes blink-in {
    0%,
    30%,
    60% {
      opacity: 0;
    }

    15%,
    45%,
    75%,
    to {
      opacity: 1;
    }
  }

  .title:before {
    position: absolute;
    top: calc(50% - 4px);
    left: -13px;
    border-top: 4px solid transparent;
    border-left: 8px solid currentcolor;
    border-bottom: 4px solid transparent;
    opacity: 0;
    content: '';
  }

  a:hover .title:before {
    animation: blink-in 0.3s cubic-bezier(1, 0, 0, 1) forwards;
  }

  .date {
    margin: 0;
    color: var(--primary-gray);
  }

  a:hover h6,
  a:hover .date {
    color: var(--primary);
  }
</style>
