const express = require("express");
const logger = require("morgan");
const PinsRouter = require("./routes/pins");
const Pins = require("./models/Pins");
const request = require("request"); // nos va permitir hacer peticiones http en nuestro servidor
const http = require("http");
const app = express(); // creamos una nueva instacia de express para simular nuestro servidor

app.use(logger("dev")); // logs para ver lo que esta pasando con nuestros metodos GET, POTS, etc
app.use(express.json()); // configuramos nuestra aplicacion para que siempre responda siempre como un API JSON
app.use("/api", PinsRouter.router); // rutas que queremos importar
app.set("port", 3000);

describe("Testing Router", () => {
  let server; // creamos nuestra variable server que va a ser compartida en todas las pruebas

  beforeAll(() => {
    // antes de todo inicializamos nuestr servidor
    server = http.createServer(app); // creamos nuestro servidor basado en la configuracion de nuestra aplicacion express
    server.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  describe("GET", () => {
    // GET 200
    it("200 and find pin", (done) => {
      // done permite especificar que es una ejecucion asincrona
      const data = [{ id: 1 }]; // simulamos una respuesta de la base de datos
      spyOn(Pins, "find").and.callFake((callBack) => {
        // callFake permite reemplazar la funcion espiada
        callBack(false, data);
      });
      // vamos ejecutar un consulta GET a nuestro servidor por medio de la libreria request
      request.get("http://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);
        done(); // ejecutamos el parametro done
      });
    });

    it("500", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "find").and.callFake((callBack) => {
        callBack(true, data);
      });

      request.get("http://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(500);
        done();
      });
    });

    // GET 200
    it("200 and find pin by id", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "findById").and.callFake((id, callBack) => {
        callBack(false, data);
      });

      request.get("http://localhost:3000/api/1", (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);
        done();
      });
    });

    it("500 find by id", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "findById").and.callFake((id, callBack) => {
        callBack(true, data);
      });

      request.get("http://localhost:3000/api/1", (error, response, body) => {
        expect(response.statusCode).toBe(500);
        done();
      });
    });
  });
});
