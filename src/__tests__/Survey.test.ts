import request from "supertest"
import { getConnection } from "typeorm"
import app from "../app"
import createConnection from "../database"

describe("Pesquisas", () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    })

    it("Deve ser possível criar uma nova pesquisa", async () => {
        const response = await request(app).post("/surveys")
            .send({
                title: "Title Example",
                description: "Description Example"
            })

        expect(response.status).toBe(201)
    })

    it("Dever obter todas as pesquisas", async () => {
        await request(app).post("/surveys")
            .send({
                title: "Title Example2",
                description: "Description Example2"
            })
        
        const response = await request(app).get("/surveys")

        expect(response.body.length).toBe(2)
    })
})