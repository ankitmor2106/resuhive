const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const resumes = await prisma.resume.findMany();
  for (const r of resumes) {
    let order = r.sectionOrder || [];
    let updated = false;
    if (!order.includes('projects')) { order.push('projects'); updated = true; }
    if (!order.includes('custom')) { order.push('custom'); updated = true; }
    if (updated) {
      await prisma.resume.update({
        where: { id: r.id },
        data: { sectionOrder: order }
      });
      console.log(`Updated resume ${r.id}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
