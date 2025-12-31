const { PrismaClient } = require("./prisma/generated/client.mts");
const { withAccelerate } = require("@prisma/extension-accelerate");


// FOR INITIALIZING A PRISMA PG DB INSTANCE
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate());
  }
  prisma = global.prisma;
}

module.exports = prisma;