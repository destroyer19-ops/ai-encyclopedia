import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const enrolls = await prisma.enrollment.findMany();
    console.log("Enrollments:", enrolls);
    const courses = await prisma.course.findMany();
    console.log("Courses:", courses);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
