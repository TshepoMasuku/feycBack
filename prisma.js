const { PrismaClient } = require('@prisma/client');

// FOR INITIALIZING A PRISMA PG DB INSTANCE
let prisma;

if (process.env.NODE_ENV === "production") {
  // prisma = new PrismaClient({
  //   accelerateUrl: process.env.DATABASE_URL,
  // });
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;