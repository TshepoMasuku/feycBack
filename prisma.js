const { PrismaClient } = require("./generated/prisma/client.mts");
const { withAccelerate } = require("@prisma/extension-accelerate");

// FOR INITIALIZING A PRISMA PG DB INSTANCE
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient().$extends(withAccelerate());
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient().$extends(withAccelerate());
  }
  prisma = global.prisma;
}

module.exports = prisma;