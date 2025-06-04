// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { invoices, customers, revenue, users } from '../../app/lib/placeholder-data';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });
    })
  );

  // Seed Customers
  await Promise.all(
    customers.map((customer) =>
      prisma.customer.upsert({
        where: { id: customer.id },
        update: {},
        create: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url,
        },
      })
    )
  );

  // Seed Invoices
  await Promise.all(
    invoices.map((invoice) =>
      prisma.invoice.upsert({
        where: { id: invoice.id },
        update: {},
        create: {
          id: invoice.id,
          customer_id: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status,
          date: new Date(invoice.date),
        },
      })
    )
  );

  // Seed Revenue
  await Promise.all(
    revenue.map((rev) =>
      prisma.revenue.upsert({
        where: { month: rev.month },
        update: {},
        create: {
          month: rev.month,
          revenue: rev.revenue,
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });