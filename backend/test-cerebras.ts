import { ConfigService } from '@nestjs/config';
import { CerebrasProvider } from './src/modules/ai/providers/cerebras.provider';

async function test() {
  const config = new ConfigService({ CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY });
  const provider = new CerebrasProvider(config);
  try {
    const res = await provider.rewriteSection('I wrote some code today.');
    console.log("SUCCESS:", res);
  } catch (e) {
    console.error("FAILED:", e);
  }
}
test();
