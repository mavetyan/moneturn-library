import { PrismaClient } from "@prisma/client";
import supertest from "supertest";

// Use 'any' for request type to avoid type mismatch due to supertest type issues in ESM/TypeScript

describe("Authors API", () => {
  let prisma: PrismaClient;
  let request: any;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    request = supertest("http://localhost:3001");
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.$disconnect();
  });

  test("POST /authors creates an author", async () => {
    const res = await request.post("/authors").send({ name: "Test Author" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Test Author");
  });

  test("GET /authors returns authors", async () => {
    const res = await request.get("/authors");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Books API", () => {
  let prisma: PrismaClient;
  let request: any;
  let authorId: number;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    request = supertest("http://localhost:3001");
    const author = await prisma.author.create({ data: { name: "Book Author" } });
    authorId = author.id;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.$disconnect();
  });

  test("POST /books creates a book", async () => {
    const res = await request.post("/books").send({ title: "Test Book", authorId });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Test Book");
    expect(res.body.authorId).toBe(authorId);
  });

  test("GET /books returns books", async () => {
    const res = await request.get("/books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
