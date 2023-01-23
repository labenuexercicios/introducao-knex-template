import { db } from './database/knex';
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        
        res.status(200).send("pong")

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

app.get("/bands", async (req: Request, res: Response) => {
    try {
        
        const result = await db.raw(`
           SELECT * FROM bands;
        `)
        res.status(200).send({bandas: result})

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

app.put("/bands", async (req: Request, res: Response) => {
    try {
        const {id, name} = req.body

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' inválido, deve ser uma string")
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'name' inválido, deve ser uma string")
        }

        if(id.length <1 || name.length <1){
            res.status(400)
            throw new Error("'id' e 'name' devem ter no minimo 1 caractere")
        }

        await db.raw(`
          INSERT INTO bands(id,name)
          VALUES ("${id}", "${name}");
        `)

        res.status(200).send("banda cadastrada com sucesso!")
        
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


app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id
        const newName = req.body.name

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

						if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 2) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 2 caracteres")
            }
        }

        const [ band ] = await db.raw(`
					SELECT * FROM bands
					WHERE id = "${id}";
				`)

		
        if (band) {
						await db.raw(`
							UPDATE users
							SET
								id = "${newId || band.id}",
								name = "${newName || band.name}",
							WHERE
								id = "${id}";
						`)

        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
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
