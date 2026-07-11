import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const resumes = await prisma.resume.findMany();
  for (const resume of resumes) {
    if (!resume.experience || (Array.isArray(resume.experience) && resume.experience.length === 0)) {
       console.log("Updating resume:", resume.id);
       // we just add dummy data
       await prisma.resume.update({
         where: { id: resume.id },
         data: {
           experience: [
             {
               id: crypto.randomUUID(),
               company: "ZARA",
               role: "Retail Sales Associate",
               location: "New Delhi, India",
               startDate: "02/2017",
               endDate: "Current",
               current: true,
               bullets: [
                 "Increased monthly sales 10% by effectively upselling and cross-selling products to maximize profitability."
               ]
             }
           ],
           skills: [
             {
               id: crypto.randomUUID(),
               category: "Skills",
               items: ["Cash register operation", "POS system operation", "Sales expertise", "Teamwork", "Inventory management"]
             }
           ],
           education: [
             {
               id: crypto.randomUUID(),
               institution: "Oxford Software Institute",
               degree: "Diploma",
               field: "Financial Accounting",
               startYear: "2013",
               endYear: "2016",
               grade: ""
             }
           ],
           professionalSummary: resume.professionalSummary || "Customer-focused Retail Sales professional with solid understanding of retail dynamics, marketing and customer service."
         }
       })
    }
  }
  console.log("Done");
}
main().finally(() => prisma.$disconnect());
