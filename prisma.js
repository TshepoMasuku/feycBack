const { PrismaClient } = require('@prisma/client/edge');
const { withAccelerate } = require('@prisma/extension-accelerate');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient().$extends(withAccelerate());
} else {
  // Prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient().$extends(withAccelerate());
  }
  prisma = global.prisma;
}

module.exports = prisma;