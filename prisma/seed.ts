import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import currency from "./currency.json";

const prisma = new PrismaClient();
const clearOldData = true;

// Sample users data
const usersData: Prisma.UserCreateInput[] = [
  {
    email: "user1@example.com",
    hashedPassword: "",
    firstName: "John",
    lastName: "Doe",
    isRegistered: true,
  },
  {
    email: "user2@example.com",
    hashedPassword: "",
    firstName: "Jane",
    lastName: "Smith",
    isRegistered: true,
  },
  {
    email: "user3@example.com",
    hashedPassword: "",
    firstName: "Alice",
    lastName: "Brown",
    isRegistered: true,
  },
  {
    email: "user4@example.com",
    hashedPassword: "",
    firstName: "Bob",
    lastName: "Davis",
    isRegistered: true,
  },
  {
    email: "user5@example.com",
    hashedPassword: "",
    firstName: "Charlie",
    lastName: "Wilson",
    isRegistered: true,
  },
];

async function main() {
  if (clearOldData) {
    console.log(`Start clearing old data ...`);

    // Delete in the order of dependencies
    await prisma.share.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.group.deleteMany();
    await prisma.currency.deleteMany();
    await prisma.user.deleteMany();

    console.log(`Old data cleared.`);
  }

  console.log(`Start seeding ...`);

  console.log(`Inserting Users ...`);
  // Hash passwords and create users
  let i = 1;
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash("password" + i++, 10);
    user.hashedPassword = hashedPassword;
    await prisma.user.create({
      data: user,
    });
  }
  // Fetch the user IDs based on their emails
  const user1 = await prisma.user.findUnique({
    where: { email: "user1@example.com" },
  });
  const user2 = await prisma.user.findUnique({
    where: { email: "user2@example.com" },
  });
  const user3 = await prisma.user.findUnique({
    where: { email: "user3@example.com" },
  });
  const user4 = await prisma.user.findUnique({
    where: { email: "user4@example.com" },
  });
  const user5 = await prisma.user.findUnique({
    where: { email: "user5@example.com" },
  });
  console.log(`Users Created...`);

  const currencies = await seedCurrrency();
  //get INR  from currencies
  const INR = currencies.find((currency) => currency.code == "INR");

  // Sample groups and expenses data with shares
  const groupsData: Prisma.GroupCreateInput[] = [
    {
      groupName: "Trip to Paris",
      groupDescription: "Expenses for the Paris trip",
      totalExpense: 5000,
      currency: { connect: { code: INR!.code } },
      splitEase: true,
      createdBy: { connect: { userId: user1!.userId } },
      users: {
        connect: [
          { userId: user1!.userId },
          { userId: user2!.userId },
          { userId: user3!.userId },
          { userId: user4!.userId },
        ],
      },
      expenses: {
        create: [
          {
            expenseType: "FOOD",
            paidById: user1!.userId,
            expenseDescription: "Dinner at Eiffel Tower",
            amount: 7000,
            expenseDate: new Date(),
            isSplitEqually: true,
            addedById: user1!.userId,
            shares: {
              create: [
                {
                  share: 1,
                  paidToId: user1!.userId,
                  amount: 1000,
                },
                {
                  share: 1,
                  paidToId: user2!.userId,
                  amount: 1000,
                },
                {
                  share: 1,
                  paidToId: user3!.userId,
                  amount: 1000,
                },
              ],
            },
          },
          {
            expenseType: "PETROL",
            paidById: user2!.userId,
            expenseDescription: "Car rental",
            amount: 4000,
            expenseDate: new Date(),
            isSplitEqually: false,
            addedById: user1!.userId,
            shares: {
              create: [
                {
                  share: 1500,
                  paidToId: user1!.userId,
                  amount: 1500,
                },
                {
                  share: 1500,
                  paidToId: user3!.userId,
                  amount: 150,
                },
                {
                  share: 1000,
                  paidToId: user4!.userId,
                  amount: 1000,
                },
              ],
            },
          },
        ],
      },
    },
    {
      groupName: "Office Party",
      groupDescription: "Monthly office party expenses",
      totalExpense: 5000,
      currency: { connect: { code: INR!.code } },
      splitEase: true,
      createdBy: { connect: { userId: user2!.userId } },
      users: {
        connect: [
          { userId: user1!.userId },
          { userId: user2!.userId },
          { userId: user3!.userId },
          { userId: user4!.userId },
        ],
      },
      expenses: {
        create: [
          {
            expenseType: "SNACKS",
            paidById: user3!.userId,
            expenseDescription: "Snacks and drinks",
            amount: 2000,
            expenseDate: new Date(),
            isSplitEqually: false,
            addedById: user1!.userId,
            shares: {
              create: [
                {
                  share: 1,
                  paidToId: user1!.userId,
                  amount: 500,
                },
                {
                  share: 1,
                  paidToId: user2!.userId,
                  amount: 500,
                },
                {
                  share: 2,
                  paidToId: user4!.userId,
                  amount: 1000,
                },
              ],
            },
          },
          {
            expenseType: "MOVIE",
            paidById: user4!.userId,
            expenseDescription: "Movie tickets",
            amount: 3000,
            expenseDate: new Date(),
            isSplitEqually: true,
            addedById: user2!.userId,
            shares: {
              create: [
                {
                  share: 1,
                  paidToId: user1!.userId,
                  amount: 1000,
                },
                {
                  share: 1,
                  paidToId: user3!.userId,
                  amount: 1000,
                },
                {
                  share: 1,
                  paidToId: user2!.userId,
                  amount: 1000,
                },
              ],
            },
          },
        ],
      },
    },
    {
      groupName: "Family Reunion",
      groupDescription: "Expenses for the family gathering",
      totalExpense: 500,
      currency: { connect: { code: INR!.code } },
      splitEase: true,
      createdBy: { connect: { userId: user4!.userId } },
      users: {
        connect: [{ userId: user4!.userId }, { userId: user5!.userId }],
      },
      expenses: {
        create: [
          {
            expenseType: "RENT",
            paidById: user1!.userId,
            expenseDescription: "Hall rental",
            amount: 500,
            expenseDate: new Date(),
            isSplitEqually: false,
            addedById: user3!.userId,
            shares: {
              create: [
                {
                  paidToId: user4!.userId,
                  amount: 200,
                },
                {
                  paidToId: user5!.userId,
                  amount: 300,
                },
              ],
            },
          },
        ],
      },
    },
    {
      groupName: "Beach Vacation",
      groupDescription: "Expenses for the beach vacation",
      totalExpense: 1750,
      currency: { connect: { code: INR!.code } },
      splitEase: true,
      createdBy: { connect: { userId: user5!.userId } },
      users: {
        connect: [
          { userId: user1!.userId },
          { userId: user5!.userId },
          { userId: user3!.userId },
          { userId: user4!.userId },
        ],
      },
      expenses: {
        create: [
          {
            expenseType: "GROCERIES",
            paidById: user5!.userId,
            expenseDescription: "Groceries for the trip",
            amount: 250,
            expenseDate: new Date(),
            isSplitEqually: false,
            addedById: user1!.userId,
            shares: {
              create: [
                {
                  paidToId: user1!.userId,
                  amount: 100,
                },
                {
                  paidToId: user3!.userId,
                  amount: 100,
                },
                {
                  paidToId: user4!.userId,
                  amount: 50,
                },
              ],
            },
          },
          {
            expenseType: "DRINKS",
            paidById: user2!.userId,
            expenseDescription: "Beverages",
            amount: 1500,
            expenseDate: new Date(),
            isSplitEqually: false,
            addedById: user5!.userId,
            shares: {
              create: [
                {
                  share: 2,
                  paidToId: user3!.userId,
                  amount: 1000,
                },
                {
                  share: 1,
                  paidToId: user5!.userId,
                  amount: 500,
                },
              ],
            },
          },
        ],
      },
    },
  ];
  // Create groups, expenses, and shares
  for (const group of groupsData) {
    await prisma.group.create({
      data: group,
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
async function seedCurrrency() {
  console.log("Start seeding currencies...");

  for (const [code, name] of Object.entries(currency)) {
    await prisma.currency.create({
      data: {
        code,
        name,
      },
    });
  }
  //get all currencies
  const currencies = await prisma.currency.findMany();
  console.log("Currency seeding finished.");
  return currencies;
}
