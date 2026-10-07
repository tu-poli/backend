import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { CategoriaActividadService } from "./categoria-actividad.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CategoriaActividadService", () => {
  let service: CategoriaActividadService;

  const mockCategorias = [
    { id_categoria: 1, nombre: "Clase" },
    { id_categoria: 2, nombre: "Deporte" },
  ];

  const mockPrismaService = {
    categoriaActividad: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaActividadService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriaActividadService>(CategoriaActividadService);
  });

  describe("create", () => {
    it("debe crear una categoría si el nombre no existe", async () => {
      mockPrismaService.categoriaActividad.findFirst.mockResolvedValue(null);
      mockPrismaService.categoriaActividad.findMany.mockResolvedValue(
        mockCategorias,
      );
      mockPrismaService.categoriaActividad.create.mockResolvedValue({
        id_categoria: 3,
        nombre: "Natacion",
      });

      const result = await service.create({ nombre: "Natacion" });
      expect(result).toEqual({ id_categoria: 3, nombre: "Natacion" });
      expect(mockPrismaService.categoriaActividad.create).toHaveBeenCalledWith({
        data: { nombre: "Natacion" },
      });
    });

    it("debe lanzar ConflictException si el nombre ya existe con otra combinación de mayúsculas/minúsculas", async () => {
      // Supongamos que en la DB ya existe 'Deporte', y el usuario intenta crear 'deporte'
      mockPrismaService.categoriaActividad.findFirst.mockResolvedValue(null);
      mockPrismaService.categoriaActividad.findMany.mockResolvedValue(
        mockCategorias,
      );

      await expect(service.create({ nombre: "deporte" })).rejects.toThrow(
        ConflictException,
      );
      expect(
        mockPrismaService.categoriaActividad.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("debe retornar todas las categorías cuando no se envía filtro de nombre", async () => {
      mockPrismaService.categoriaActividad.findMany.mockResolvedValue(
        mockCategorias,
      );

      const result = await service.findAll();
      expect(result).toEqual(mockCategorias);
      expect(
        mockPrismaService.categoriaActividad.findMany,
      ).toHaveBeenCalledWith();
    });

    it("debe buscar sin discriminar mayúsculas ni minúsculas", async () => {
      mockPrismaService.categoriaActividad.findMany.mockImplementation(
        (args) => {
          if (args?.where?.nombre?.contains) {
            // Simula comportamiento de búsqueda
            return Promise.resolve([{ id_categoria: 2, nombre: "Deporte" }]);
          }
          return Promise.resolve(mockCategorias);
        },
      );

      const result = await service.findAll("deporte");
      expect(result).toEqual([{ id_categoria: 2, nombre: "Deporte" }]);
    });
  });

  describe("findOne", () => {
    it("debe retornar la categoría si existe", async () => {
      mockPrismaService.categoriaActividad.findUnique.mockResolvedValue(
        mockCategorias[0],
      );

      const result = await service.findOne(1);
      expect(result).toEqual(mockCategorias[0]);
    });

    it("debe lanzar NotFoundException si no existe", async () => {
      mockPrismaService.categoriaActividad.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("debe lanzar ConflictException si el nuevo nombre ya está en uso por otra categoría ignorando mayúsculas/minúsculas", async () => {
      mockPrismaService.categoriaActividad.findUnique.mockResolvedValue({
        id_categoria: 1,
        nombre: "Clase",
      });
      // La categoría 2 es 'Deporte', intentamos renombrar 1 a 'DEPORTE'
      mockPrismaService.categoriaActividad.findFirst.mockResolvedValue(null);
      mockPrismaService.categoriaActividad.findMany.mockResolvedValue(
        mockCategorias,
      );

      await expect(service.update(1, { nombre: "DEPORTE" })).rejects.toThrow(
        ConflictException,
      );
    });

    it("debe actualizar la categoría exitosamente si no hay colisión", async () => {
      mockPrismaService.categoriaActividad.findUnique.mockResolvedValue({
        id_categoria: 1,
        nombre: "Clase",
      });
      mockPrismaService.categoriaActividad.findFirst.mockResolvedValue(null);
      mockPrismaService.categoriaActividad.findMany.mockResolvedValue([]);
      mockPrismaService.categoriaActividad.update.mockResolvedValue({
        id_categoria: 1,
        nombre: "Taller",
      });

      const result = await service.update(1, { nombre: "Taller" });
      expect(result.nombre).toBe("Taller");
    });
  });

  describe("remove", () => {
    it("debe eliminar la categoría existente", async () => {
      mockPrismaService.categoriaActividad.findUnique.mockResolvedValue(
        mockCategorias[0],
      );
      mockPrismaService.categoriaActividad.delete.mockResolvedValue(
        mockCategorias[0],
      );

      const result = await service.remove(1);
      expect(result).toEqual(mockCategorias[0]);
    });
  });
});
