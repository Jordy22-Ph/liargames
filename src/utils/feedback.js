export async function submitFeedback(message) {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `📮 **라이어 게임 건의사항**\n${message}`,
    }),
  })

  if (!res.ok) {
    throw new Error(`전송에 실패했어요. (${res.status})`)
  }
}
