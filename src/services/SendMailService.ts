import nodemailer, { Transporter } from "nodemailer"
import handlebars from "handlebars"
import fs from "fs"

class SendMilService {

    private client: Transporter
    
    constructor() {
        nodemailer.createTestAccount()
            .then(account => {
                const { user, pass } = account
                const { host, port, secure } = account.smtp
                
                const transporter = nodemailer.createTransport({
                    host,
                    port,
                    secure,
                    auth: {
                        user,
                        pass
                    }
                })

                this.client = transporter
            })
    }

    async execute(to: string, subject: string, body: object, path: string) {
        const template = fs.readFileSync(path).toString("utf-8")

        const mailTemplate = handlebars.compile(template)
        const html = mailTemplate(body)
        
        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com.br>"
        })

        console.log("Message sent: %s", message.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))
    }
}

export default new SendMilService()