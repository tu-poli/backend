import { Test, TestingModule } from "@nestjs/testing";
import { CategoriaActividadController } from "./categoria-actividad.controller";
import { CategoriaActividadService } from "./categoria-actividad.service";

describe("CategoriaActividadController", () => {
  let controller: CategoriaActividadController;
  let service: CategoriaActividadService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaActividadController],
      providers: [
        {
          provide: CategoriaActividadService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CategoriaActividadController>(
      CategoriaActividadController,
    );
    service = module.get<CategoriaActividadService>(CategoriaActividadService);
  });

  it("debe estar definido", () => {
    expect(controller).toBeDefined();
  });

  it("create debe llamar al servicio con el dto", async () => {
    const dto = { nombre: "Deporte" };
    mockService.create.mockResolvedValue({ id_categoria: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id_categoria: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("findAll debe llamar al servicio con el nombre del query", async () => {
    mockService.findAll.mockResolvedValue([
      { id_categoria: 1, nombre: "Deporte" },
    ]);

    const result = await controller.findAll({ nombre: "deporte" });
    expect(result).toEqual([{ id_categoria: 1, nombre: "Deporte" }]);
    expect(service.findAll).toHaveBeenCalledWith("deporte");
  });

  it("findOne debe llamar al servicio con el id numérico", async () => {
    mockService.findOne.mockResolvedValue({
      id_categoria: 1,
      nombre: "Deporte",
    });

    const result = await controller.findOne("1");
    expect(result).toEqual({ id_categoria: 1, nombre: "Deporte" });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it("update debe llamar al servicio con id y dto", async () => {
    const dto = { nombre: "Gimnasio" };
    mockService.update.mockResolvedValue({ id_categoria: 1, ...dto });

    const result = await controller.update("1", dto);
    expect(result).toEqual({ id_categoria: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it("remove debe llamar al servicio con id", async () => {
    mockService.remove.mockResolvedValue({
      id_categoria: 1,
      nombre: "Deporte",
    });

    await controller.remove("1");
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
