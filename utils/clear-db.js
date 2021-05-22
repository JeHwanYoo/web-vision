const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()

  await prisma.image.deleteMany()

  prisma.$disconnect()
}

main()
