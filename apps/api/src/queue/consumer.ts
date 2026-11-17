import type { Env } from "../types/env.js";

export async function handleQueueMessage(batch: MessageBatch<any>, env: Env): Promise<void> {
  console.log(`[QueueConsumer] Received batch with ${batch.messages.length} messages.`);
  for (const message of batch.messages) {
    try {
      const payload = message.body;
      console.log(`[QueueConsumer] Processing job type=${payload.type} for companyId=${payload.companyId}`);
      // Acknowledge successful processing
      message.ack();
    } catch (err) {
      console.error(`[QueueConsumer] Error processing message:`, err);
      message.retry();
    }
  }
}
