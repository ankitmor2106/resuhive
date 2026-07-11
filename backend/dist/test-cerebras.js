"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const cerebras_provider_1 = require("./src/modules/ai/providers/cerebras.provider");
async function test() {
    const config = new config_1.ConfigService({ CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY });
    const provider = new cerebras_provider_1.CerebrasProvider(config);
    try {
        const res = await provider.rewriteSection('I wrote some code today.');
        console.log("SUCCESS:", res);
    }
    catch (e) {
        console.error("FAILED:", e);
    }
}
test();
//# sourceMappingURL=test-cerebras.js.map