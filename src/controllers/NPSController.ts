import { Request, Response } from "express"
import { getCustomRepository, IsNull, Not } from "typeorm"
import SurveyUserRepository from "../repositories/SurveyUserRepository"

function calculaNPS(detratores: number, promotores: number, respondentes: number) {
    return (promotores - detratores) / respondentes * 100
}

class NPSController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params

        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const surveyUserArray = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detratores = surveyUserArray.filter(survey => survey.value >= 0 && survey.value <= 6).length
        const promotores = surveyUserArray.filter(survey => survey.value >= 9 && survey.value <= 10).length
        const passivos = surveyUserArray.filter(survey => survey.value >= 7 && survey.value <= 8).length
        const respondentes = surveyUserArray.length

        const nps = calculaNPS(detratores, promotores, respondentes)

        return response.json({
            detratores,
            promotores,
            passivos,
            respondentes,
            nps
        })
    }
}

export default new NPSController()