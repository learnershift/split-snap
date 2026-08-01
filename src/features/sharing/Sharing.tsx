export function Sharing({ text }: { text: string }) {
  async function copyResultText() {
    await navigator.clipboard.writeText(text)
  }

  async function shareResultText() {
    if (!navigator.share) {
      await copyResultText()
      return
    }

    try {
      await navigator.share({ text })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        await copyResultText()
        return
      }

      throw error
    }
  }

  return (
    <section aria-label="Share result">
      <p>Copy writes this exact plaintext to your clipboard.</p>
      <pre>{text}</pre>
      <button onClick={copyResultText} type="button">Copy result text</button>
      <button onClick={shareResultText} type="button">Share result text</button>
    </section>
  )
}
