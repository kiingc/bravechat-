export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages inválidas' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: `És o BraveChat — um coach masculino direto, honesto e sem filtros. Ajudas homens a superar a timidez, a comunicar melhor com mulheres, a desenvolver confiança e mentalidade forte. Falas em português de Portugal. És assertivo mas empático. Dás conselhos práticos, não vagos. Nunca és condescendente. Usas linguagem simples e direta. Nunca usas emojis em excesso — máximo 1 por resposta. Respostas curtas e impactantes, máximo 3 parágrafos.`,
        messages: messages.slice(-10)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Erro da API' });
    }

    return res.status(200).json({ reply: data.content[0].text });

  } catch (err) {
    console.error('Anthropic error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

