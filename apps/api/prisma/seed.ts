import { PrismaClient, Role, BookStatus, PublishStatus, ProjectStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      passwordHash,
      role: Role.ADMIN
    }
  });

  const book = await prisma.book.create({
    data: {
      title: "Sample Manga",
      slug: "sample-manga",
      altTitles: ["サンプル"],
      description: "Seeded sample",
      language: "en",
      status: BookStatus.ONGOING,
      createdById: admin.id
    }
  });

  const chapter = await prisma.chapter.create({
    data: {
      bookId: book.id,
      number: "1",
      title: "Chapter One",
      orderIndex: 1,
      publishStatus: PublishStatus.DRAFT
    }
  });

  const page = await prisma.page.create({
    data: {
      chapterId: chapter.id,
      pageNumber: 1,
      imageUrl: "https://example.com/page-1.jpg",
      width: 1200,
      height: 1800,
      checksum: "seed"
    }
  });

  await prisma.translationProject.create({
    data: {
      chapterId: chapter.id,
      ownerId: admin.id,
      status: ProjectStatus.ACTIVE,
      assignments: {
        create: [{ userId: admin.id }]
      },
      entries: {
        create: [
          {
            pageId: page.id,
            box: { x: 10, y: 10, w: 300, h: 100 },
            sourceText: "こんにちは",
            translatedText: "Hello",
            status: "IN_PROGRESS"
          }
        ]
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
