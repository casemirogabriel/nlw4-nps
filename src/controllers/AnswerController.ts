import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { AppError } from "../errors/AppError"
import SurveyUserRepository from "../repositories/SurveyUserRepository"

class AnswerController {
    async execute(request: Request, response: Response) {
        const { value } = request.params
        const { su } = request.query

        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const surveyUser = await surveyUserRepository.findOne({ id: String(su) })

        if (!surveyUser) {
            throw new AppError("Pesquisa não existe para este usuário.")
        }

        surveyUser.value = Number(value)
        await surveyUserRepository.save(surveyUser)

        return response.json(surveyUser)
    }
}

export default new AnswerController()