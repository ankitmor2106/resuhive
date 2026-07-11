"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log('Users:', users.length);
    const resumes = await prisma.resume.findMany();
    console.log('Resumes:', resumes.map(r => r.id));
    const suggestions = await prisma.aISuggestion.findMany();
    console.log('Suggestions:', suggestions);
}
main();
//# sourceMappingURL=test-db.js.map