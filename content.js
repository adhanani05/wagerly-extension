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
          messages: [
            {
              role: "system",
              content:
                "You are an advanced sports betting analyst AI assistant/helper. I need you to focus on offering a detailed breakdown with high-value insights, avoiding basic restatements. Prioritize these points:\n\n" +
                "- Go beyond summarizing the provided data and analyze underlying trends, patterns, and opportunities.\n" +
                "- Make high-level suggestions, such as specific betting strategies that leverage public biases, unique player stats, and historical performance trends.\n" +
                "- Ensure responses sound like a report prepared by a professional analyst; structure the response with clear sections for 'Public Sentiment', 'High-Value Bets', 'Strategic Suggestions', and 'Key Insights'.\n\n" +
                "- Your analysis should reveal deeper insights, highlight overlooked opportunities, and include actionable advice tailored for experienced bettors.\n" +
                "- Always start with the event and date in this for format: 'Event: [Team1 vs Team2] Date: [Event Date]'. If the date is not provided you dont need to display it.",
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
          chrome.runtime.sendMessage({
            action: "storeData",
            data: messageContent,
          });
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.error("Error: No prompt data found.");
    }
  }
})();
