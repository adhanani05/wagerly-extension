(() => {
  const root = document.getElementById("main-view").innerText;

  const apiKey =
    "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";

  if (root) {
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
            content: "You are a sports betting analyst.",
          },
          {
            role: "user",
            content:
              "Analyze this betting data, providing insights into likely outcomes and highlighting interesting betting opportunities or trends. Summarize where the public is leaning and assess if there is value in betting on less popular options. Include potential reasons for odds discrepancies and suggest strategies for interpreting the odds data. Interpret the provided game data and identify patterns, betting value, and key indicators of expected performance. Go beyond restating by examining which bets might provide high value based on betting splits and line movements. Offer suggestions on player props and market value where the public consensus might be overlooking opportunities. Provide a breakdown of this betting data with actionable insights, analyzing team and player odds to assess likely winners, scoring trends, and player performances. Identify potential high-value bets and, if possible, suggest specific betting strategies based on observed betting splits and public biases. Here is the data: " +
              root,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const contentDiv = document.getElementById("content");
        contentDiv.innerText = data.choices[0].message.content;
      })
      .catch((error) => console.error("Error:", error));
  }
})();
