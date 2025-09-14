const Fastify = require("fastify");
const cors = require("@fastify/cors");
const { PrismaClient } = require("@prisma/client");

// Define proper types
interface AuthorParams {
  id: string;
}

interface AuthorBody {
  name: string;
}

interface BookParams {
  id: string;
}

interface BookBody {
  title: string;
  authorId: number;
}

const fastify = Fastify({ logger: true });

// Register CORS
fastify.register(cors, {
  origin: true, // Allow all origins (for development)
});

const prisma = new PrismaClient();

// Validation helper
const validateId = (id: string): number => {
  const numId = Number(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error("Invalid ID");
  }
  return numId;
};

// Error handler helper
const handleError = (reply: any, error: any, message: string) => {
  fastify.log.error(error);
  return reply.status(500).send({ message });
};

// Authors CRUD with proper types and error handling
fastify.get("/authors", async () => {
  try {
    return await prisma.author.findMany({ include: { books: true } });
  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
});

fastify.get("/authors/:id", async (request: any, reply: any) => {
  try {
    const id = validateId(request.params.id);
    const author = await prisma.author.findUnique({ 
      where: { id }, 
      include: { books: true } 
    });
    
    if (!author) {
      return reply.status(404).send({ message: "Author not found" });
    }
    
    return author;
  } catch (error: any) {
    if (error.message === "Invalid ID") {
      return reply.status(400).send({ message: "Invalid author ID" });
    }
    return handleError(reply, error, "Failed to fetch author");
  }
});

fastify.post("/authors", async (request: any, reply: any) => {
  try {
    const { name } = request.body;
    
    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ message: "Author name is required" });
    }
    
    return await prisma.author.create({ 
      data: { name: name.trim() } 
    });
  } catch (error) {
    return handleError(reply, error, "Failed to create author");
  }
});

fastify.put("/authors/:id", async (request: any, reply: any) => {
  try {
    const id = validateId(request.params.id);
    const { name } = request.body;
    
    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ message: "Author name is required" });
    }
    
    const author = await prisma.author.update({ 
      where: { id }, 
      data: { name: name.trim() } 
    });
    
    return author;
  } catch (error: any) {
    if (error.message === "Invalid ID") {
      return reply.status(400).send({ message: "Invalid author ID" });
    }
    if (error.code === 'P2025') {
      return reply.status(404).send({ message: "Author not found" });
    }
    return handleError(reply, error, "Failed to update author");
  }
});

fastify.delete("/authors/:id", async (request: any, reply: any) => {
  try {
    const id = validateId(request.params.id);
    await prisma.author.delete({ where: { id } });
    return { message: "Author deleted successfully" };
  } catch (error: any) {
    if (error.message === "Invalid ID") {
      return reply.status(400).send({ message: "Invalid author ID" });
    }
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      return reply.status(400).send({ 
        message: "Cannot delete author. This author has books associated with them." 
      });
    }
    if (error.code === 'P2025') {
      return reply.status(404).send({ message: "Author not found" });
    }
    return handleError(reply, error, "Failed to delete author");
  }
});

// Books CRUD with proper types and error handling
fastify.get("/books", async () => {
  try {
    return await prisma.book.findMany({ include: { author: true } });
  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
});

fastify.get("/books/:id", async (request: any, reply: any) => {
  try {
    const id = validateId(request.params.id);
    const book = await prisma.book.findUnique({ 
      where: { id }, 
      include: { author: true } 
    });
    
    if (!book) {
      return reply.status(404).send({ message: "Book not found" });
    }
    
    return book;
  } catch (error: any) {
    if (error.message === "Invalid ID") {
      return reply.status(400).send({ message: "Invalid book ID" });
    }
    return handleError(reply, error, "Failed to fetch book");
  }
});

fastify.post("/books", async (request: any, reply: any) => {
  try {
    const { title, authorId } = request.body;
    
    if (!title || title.trim().length === 0) {
      return reply.status(400).send({ message: "Book title is required" });
    }
    
    if (!authorId || authorId <= 0) {
      return reply.status(400).send({ message: "Valid author ID is required" });
    }
    
    return await prisma.book.create({ 
      data: { 
        title: title.trim(), 
        authorId 
      } 
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return reply.status(400).send({ message: "Invalid author ID" });
    }
    return handleError(reply, error, "Failed to create book");
  }
});

fastify.put("/books/:id", async (request: any, reply: any) => {
  try {
    const id = validateId(request.params.id);
    const { title, authorId } = request.body;
    
    if (!title || title.trim().length === 0) {
      return reply.status(400).send({ message: "Book title is required" });
    }
    
    if (!authorId || authorId <= 0) {
      return reply.status(400).send({ message: "Valid author ID is required" });
    }
    
    const book = await prisma.book.update({ 
      where: { id }, 
      data: { 
        title: title.trim(), 
        authorId 
      } 
    });
    
    return book;
  } catch (error: any) {
    if (error.message === "Invalid ID") {
      return reply.status(400).send({ message: "Invalid book ID" });
    }
    if (error.code === 'P2025') {
      return reply.status(404).send({ message: "Book not found" });
    }
    if (error.code === 'P2003') {
      return reply.status(400).send({ message: "Invalid author ID" });
    }
    return handleError(reply, error, "Failed to update book");
  }
});

fastify.delete("/books/:id", async (request: any, reply: any) => {
  try {
    const id = validateId(request.params.id);
    await prisma.book.delete({ where: { id } });
    return { message: "Book deleted successfully" };
  } catch (error: any) {
    if (error.message === "Invalid ID") {
      return reply.status(400).send({ message: "Invalid book ID" });
    }
    if (error.code === 'P2025') {
      return reply.status(404).send({ message: "Book not found" });
    }
    return handleError(reply, error, "Failed to delete book");
  }
});

module.exports = fastify;

if (require.main === module) {
  const start = async () => {
    try {
      await fastify.listen({ port: 3001, host: "0.0.0.0" });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  start();
}
