import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import SurveyRepository from "../repositories/SurveyRepository"
import SurveyUserRepository from "../repositories/SurveyUserRepository"
import UserRepository from "../repositories/UserRepository"
import sendMailService from "../services/SendMailService"
import path from "path"
import { AppError } from "../errors/AppError"

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body

        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const user = await userRepository.findOne({ email })

        if (!user) {
            throw new AppError("Usuário não existe.")
        }

        const survey = await surveyRepository.findOne({ id: survey_id })

        if (!survey) {
            throw new AppError("Pesquisa não existe.")
        }

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        })

        const npsPath = path.resolve(__dirname, "..", "views", "emails", "npsMail.hbs")

        const body = {
            name: user.name,
            title: survey.title,
            desciption: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            body.id = surveyUserAlreadyExists.id
            await sendMailService.execute(email, survey.title, body, npsPath)

            return response.json(surveyUserAlreadyExists)
        }

        //SALVAR NA TABELA
        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveyUserRepository.save(surveyUser)

        //ENVIAR E-MAIL

        body.id = surveyUser.id
        await sendMailService.execute(
            email,
            survey.title,
            body,
            npsPath
        )

        return response.json(surveyUser)
    }
}

export default new SendMailController()