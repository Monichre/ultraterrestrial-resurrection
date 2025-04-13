import { serve } from "@upstash/workflow/nextjs";
import { Client } from "@upstash/qstash";
export const { POST } = serve(async (context) => {
	await context.run("first-step", () => {
		console.log("first step ran");
	});

	await context.run("second-step", () => {
		console.log("second step ran");
	});
});

const client = new Client({
	token:
		"eyJVc2VySUQiOiJmMTFlYTRiOS02OTBiLTQ3Y2EtODJiMi04ZDcwNGQ2ZTJlYTkiLCJQYXNzd29yZCI6ImZkNDY1MjJjMTNmMDRlNWY5MDI1MGRlMjBiZjQ0MGNkIn0=",
});

client
	.queue({
		queueName: "knowledge-base-data-processing",
	})
	.enqueue({
		url: "https://www.ultraterrestrial.app/api/workflow/processing",
		body: "test",
	});
