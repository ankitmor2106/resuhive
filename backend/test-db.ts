import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users.length);
  const resumes = await prisma.resume.findMany();
  console.log('Resumes:', resumes.map(r => r.id));
  const suggestions = await prisma.aISuggestion.findMany();
  console.log('Suggestions:', suggestions);
}
main();
