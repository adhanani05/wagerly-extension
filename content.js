(() => {
  let prompt = "";
  let hasFetchedData = false; // Flag to track fetch status

  const betmgm_root = document.getElementById("main-view");
  if (betmgm_root) {
    prompt += betmgm_root.innerText + "\n";
  }

  const draftkings_root = document.getElementById("event-page-wrapper");
  if (draftkings_root) {
    prompt += draftkings_root.innerText + "\n";
  }

  if (prompt && !hasFetchedData) {
    hasFetchedData = true;
    if (prompt) {
      const apiKey =
        "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";

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_completion_tokens: 600,
          messages: [
            {
              role: "system",
              content:
                "You are an advanced sports betting analyst AI assistant. Please provide a highly detailed analysis with concise, high-value insights. Structure the response with the following sections, each limited to 50 words: \n" +
                "- Public Sentiment: Analyze underlying biases in public opinion toward star players, game momentum, or standout plays that may influence betting trends. Avoid restating basic information. \n" +
                "- High-Value Bets: Highlight specific betting opportunities, including odds and rationale for lesser-known players where value exists. Avoid redundant summaries and focus on actionable opportunities. \n" +
                "- Strategic Suggestions: Suggest strategies that experienced bettors can use, considering public biases, player prop inefficiencies, and game-specific trends. \n" +
                "- Key Insights: Offer high-level takeaways that capture game dynamics or betting trends, emphasizing actionable insights for future bets. \n" +
                "- Use <h2> tags for headings and <p> tags for paragraphs, with inline CSS. Make font size 20 for event title (and bold), 15 for headers (and bold), and 15 for text, to enhance readability. Use bullet points and break information with new lines so it is not a big paragraph and more readable. Begin each response with the event title in this format: 'Event: [Team1 vs Team2].",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const messageContent = data.choices[0].message.content;
          console.log(messageContent);
          chrome.runtime.sendMessage(
            { action: "storeData", data: messageContent },
            () => {
              chrome.runtime.sendMessage({ action: "updateContent" });
            }
          );
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.error("Error: No prompt data found.");
    }
  }
})();
