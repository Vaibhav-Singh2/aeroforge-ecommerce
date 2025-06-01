import { Prisma, PrismaClient, Product } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const LOOP_COUNT = 20;

async function main() {
  console.log(`Starting seeding with ${LOOP_COUNT} categories...`);

  await prisma.category.createMany({
    data: [
      ...Array.from(
        { length: LOOP_COUNT },
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
  console.log(`${LOOP_COUNT} categories created successfully.`);

  const categories = await prisma.category.findMany();
  console.log(`Found ${categories.length} categories for product creation.`);

  const products: Product[] = [];
  console.log("Creating products...");

  let counter = 0;
  for (const category of categories) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
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
      console.log(`Progress: ${counter}/${categories.length} products created`);
    }
  }

  console.log(`Created ${products.length} products successfully.`);
  console.log("Seeding completed successfully.");
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
