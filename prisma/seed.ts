import {
  Prisma,
  // Prisma,
  PrismaClient,
  Product,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const LOOP_COUNT = 20;

async function createCategories(count: number = LOOP_COUNT) {
  console.log(`Starting seeding with ${count} categories...`);

  await prisma.category.createMany({
    data: [
      ...Array.from(
        { length: count },
        () =>
          ({
            name: faker.company.name(),
            slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
            description: faker.lorem.sentence(),
            type: faker.helpers.arrayElement([
              "READY_MADE_PROJECT",
              "PART_AND_ACCESSORY",
            ]),
          }) as Prisma.CategoryCreateInput,
      ),
    ],
  });
  console.log(`${count} categories created successfully.`);
}

async function createProducts(countPerCategory: number = 1) {
  const categories = await prisma.category.findMany();
  console.log(`Found ${categories.length} categories for product creation.`);

  if (categories.length === 0) {
    console.log("No categories found. Please create categories first.");
    return;
  }

  const products: Product[] = [];
  console.log(
    `Creating ${countPerCategory} products per category (total: ${categories.length * countPerCategory})...`,
  );

  let counter = 0;
  for (const category of categories) {
    for (let i = 0; i < countPerCategory; i++) {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          slug: faker.helpers
            .slugify(faker.commerce.productName())
            .toLowerCase(),
          description: faker.lorem.sentence(),
          images: [
            faker.image.urlPicsumPhotos(),
            faker.image.urlPicsumPhotos(),
            faker.image.urlPicsumPhotos(),
          ],
          price: parseFloat(faker.commerce.price()),
          categoryId: category.id,
          sku: faker.string.alphanumeric(10),
        },
      });
      products.push(product);
      counter++;
      if (counter % 5 === 0) {
        console.log(
          `Progress: ${counter}/${categories.length * countPerCategory} products created`,
        );
      }
    }
  }

  console.log(`Created ${products.length} products successfully.`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();
  const count = args[1] ? parseInt(args[1]) : LOOP_COUNT;

  try {
    if (!command || command === "all") {
      await createCategories(count);
      await createProducts(count);
    } else if (command === "categories") {
      await createCategories(count);
    } else if (command === "products") {
      await createProducts(count);
    } else {
      console.error(
        "Unknown command. Available commands: all, categories, products",
      );
      console.log(
        "Usage: npx ts-node prisma/seed.ts [command] [categoryCount] [productsPerCategory]",
      );
      process.exit(1);
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    console.log("Disconnecting from the database.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
