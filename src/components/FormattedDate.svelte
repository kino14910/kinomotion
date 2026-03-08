<script>
  const { date } = $props()
</script>

<time datetime={date.toISOString()}>
  {date.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}
</time>
