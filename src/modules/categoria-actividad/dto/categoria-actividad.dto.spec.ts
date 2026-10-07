import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateCategoriaActividadDto } from "./create-categoria-actividad.dto";
import { QueryCategoriaActividadDto } from "./query-categoria-actividad.dto";

describe("CategoriaActividad DTO Validations", () => {
  describe("CreateCategoriaActividadDto", () => {
    it("debe aceptar nombres válidos solo con letras", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, {
        nombre: "Deportes",
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("debe aceptar letras con tildes y caracteres en español (á, é, í, ó, ú, ñ, ü)", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, {
        nombre: "Natación",
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("debe recortar espacios al inicio y final y ser válido", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, {
        nombre: "  Futbol  ",
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.nombre).toBe("Futbol");
    });

    it("debe rechazar nombres con espacios en el medio", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, {
        nombre: "Fut bol",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const constraints = errors[0].constraints;
      expect(JSON.stringify(constraints)).toContain(
        "El campo nombre no debe tener espacios en el medio",
      );
    });

    it("debe rechazar nombres que contengan números", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, {
        nombre: "Futbol123",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const constraints = errors[0].constraints;
      expect(JSON.stringify(constraints)).toContain(
        "El campo nombre no debe contener números",
      );
    });

    it("debe rechazar nombres con caracteres especiales o símbolos", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, {
        nombre: "Deporte!",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const constraints = errors[0].constraints;
      expect(JSON.stringify(constraints)).toContain(
        "El campo nombre solo debe contener letras, sin caracteres especiales",
      );
    });

    it("debe rechazar nombres vacíos", async () => {
      const dto = plainToInstance(CreateCategoriaActividadDto, { nombre: "" });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("QueryCategoriaActividadDto", () => {
    it("debe aceptar cuando no se envía nombre (búsqueda sin filtro)", async () => {
      const dto = plainToInstance(QueryCategoriaActividadDto, {});
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("debe aceptar término de búsqueda válido con solo letras", async () => {
      const dto = plainToInstance(QueryCategoriaActividadDto, {
        nombre: "tenis",
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("debe aceptar término de búsqueda en mayúsculas o minúsculas", async () => {
      const dtoMayus = plainToInstance(QueryCategoriaActividadDto, {
        nombre: "TENIS",
      });
      const errorsMayus = await validate(dtoMayus);
      expect(errorsMayus.length).toBe(0);

      const dtoMinus = plainToInstance(QueryCategoriaActividadDto, {
        nombre: "tenis",
      });
      const errorsMinus = await validate(dtoMinus);
      expect(errorsMinus.length).toBe(0);
    });

    it("debe rechazar parámetro de búsqueda con espacios en el medio", async () => {
      const dto = plainToInstance(QueryCategoriaActividadDto, {
        nombre: "ten is",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const constraints = errors[0].constraints;
      expect(JSON.stringify(constraints)).toContain(
        "El parámetro de búsqueda nombre no debe tener espacios en el medio",
      );
    });

    it("debe rechazar parámetro de búsqueda con números", async () => {
      const dto = plainToInstance(QueryCategoriaActividadDto, {
        nombre: "tenis1",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const constraints = errors[0].constraints;
      expect(JSON.stringify(constraints)).toContain(
        "El parámetro de búsqueda nombre no debe contener números",
      );
    });

    it("debe rechazar parámetro de búsqueda con caracteres especiales", async () => {
      const dto = plainToInstance(QueryCategoriaActividadDto, {
        nombre: "tenis$",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const constraints = errors[0].constraints;
      expect(JSON.stringify(constraints)).toContain(
        "El parámetro de búsqueda nombre solo debe contener letras, sin caracteres especiales",
      );
    });
  });
});
