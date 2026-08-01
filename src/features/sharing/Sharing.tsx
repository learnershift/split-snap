export function Sharing({ text }: { text: string }) {
  async function copyResultText() {
    await navigator.clipboard.writeText(text)
  }

  return (
    <section aria-label="Share result">
      <p>Copy writes this exact plaintext to your clipboard.</p>
      <pre>{text}</pre>
      <button onClick={copyResultText} type="button">Copy result text</button>
    </section>
  )
}
