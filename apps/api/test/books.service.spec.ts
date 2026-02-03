import { BooksService } from "../src/books/books.service";

const prismaMock = {
  book: {
    findMany: jest.fn(),
    create: jest.fn()
  }
};

describe("BooksService", () => {
  it("lists books", async () => {
    const service = new BooksService(prismaMock as any);
    prismaMock.book.findMany.mockResolvedValue([{ id: "book-1" }]);

    const result = await service.list();

    expect(result).toHaveLength(1);
  });
});
