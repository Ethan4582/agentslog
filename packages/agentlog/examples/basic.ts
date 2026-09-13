import { wrap } from "../src/index";

async function main() {
  const mockAnthropic = {
    messages: {
      create: async (params: { model: string; messages: Array<{ role: string; content: string }> }) => {
        return {
          id: "msg_example_01",
          model: params.model,
          role: "assistant" as const,
          stop_reason: "end_turn",
          content: [{ type: "text", text: "Successfully wrapped and captured with agentlog!" }],
          usage: {
            input_tokens: 35,
            output_tokens: 22
          }
        };
      }
    }
  };

  const client = wrap(mockAnthropic, { title: "Example Basic Agent Run" });

  const response = await client.messages.create({
    model: "claude-3-5-sonnet",
    messages: [{ role: "user", content: "Demonstrate agentlog capture." }]
  });

  console.log("Response:", response.content[0].text);
}

main();
