import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


app.get("/bands", async (req:Request, res:Response)=>{
    try{
        const result = await db.raw(`SELECT * FROM bands`)

        res.status(200).send(result)

    } catch(error){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//pratica 2
app.post("/bands", async(req:Request, res:Response)=>{

    try{
        const id = req.body.id
        const name = req.body.name

        //validação da informações
        if(!id || !name){
            res.status(400)
            throw new Error("id ou name inválido")
        }

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("id deve ser um texto")
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("name deve ser um texto")
        }

        //se tudo der certo, podemos fazer a query
        await db.raw(`
            INSERT INTO bands(id, name)
            VALUES("${id}", "${name}");
        `)

        res.status(200).send("Banda cadastrada com sucesso!")

    }catch(error){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

app.put("/bands/:id",async (req:Request, res:Response)=>{
    try {

        //pegar os dados
        const id = req.params.id

        const newId = req.body.id
        const newName = req.body.name //underfined


        //tratamento de dados
        if(newId !== undefined) {
            if (typeof newId !== "string"){
                res.status(400)
                throw new Error("id deve ser string")
            }
            if(newId.length <2 ){
                res.status(400)
                throw new Error("id deve possuir no mínimo 2 caracteres")
            }
        }

        if(newName !== undefined) {
            if (typeof newName !== "string"){
                res.status(400)
                throw new Error("name deve ser string")
            }
            if(newName.length < 3 ){
                res.status(400)
                throw new Error("name deve possuir no mínimo 3 caracteres")
            }
        }
        
            //[band] = [{id, name}]  => band = {id, name}
        const [band] = await db.raw( //verificar se a banda existe
            `SELECT * FROM bands
            WHERE id = "${id}";`
        ) //

        //Edição do banco de dados

        if(band){
            await db.raw(`
            UPDATE bands
            SET 
                id = "${newId || band.id}", 
                name = "${newName || band.name}"
            WHERE id = "${id}";
        `)
        }else{
            res.status(404)
            throw new Error("id não encontrado")

        }
        

        res.status(200).send("Edição feita com sucesso")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

