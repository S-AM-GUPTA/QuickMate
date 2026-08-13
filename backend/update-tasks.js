const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany();
  
  if (tasks.length >= 3) {
    // Update task 1
    await prisma.task.update({
      where: { id: tasks[0].id },
      data: {
        title: "IKEA Furniture Assembly (Kallax & Malm)",
        description: "Need someone with tools and experience to assemble a large Kallax bookshelf and a Malm bed frame in my apartment. Should take about 2-3 hours.",
        category: "Handyman",
        budget: 65,
      }
    });

    // Update task 2
    await prisma.task.update({
      where: { id: tasks[1].id },
      data: {
        title: "Deep Cleaning for 2BHK Apartment",
        description: "Moving out next week and need a thorough deep clean of the kitchen, 2 bathrooms, and living area. Cleaning supplies can be provided if needed.",
        category: "Cleaning",
        budget: 120,
      }
    });

    // Update task 3
    await prisma.task.update({
      where: { id: tasks[2].id },
      data: {
        title: "Pick up and deliver groceries",
        description: "I have a prepaid grocery order at the Whole Foods on Main St. Need someone to pick it up and deliver it to my house. Very quick task.",
        category: "Delivery",
        budget: 25,
      }
    });
    
    console.log("Updated dummy tasks to match general marketplace theme.");
  } else {
    console.log("Not enough tasks to update.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
