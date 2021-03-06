import request from "supertest"
import { getConnection } from "typeorm"
import app from "../app"
import createConnection from "../database"

describe("Usuários", () => {
    beforeAll(async () => {
        const connections = await createConnection()
        await connections.runMigrations()
    })

    afterAll(async () => {
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    })

    it("Deve ser possível criar um novo usuário", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "user@example",
                name: "User Example"
            })

        expect(response.status).toBe(201)
    })

    it("Não deve ser possível criar um usuário com e-mail existente", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "user@example",
                name: "User Example"
            })

        expect(response.status).toBe(400)
    })
})