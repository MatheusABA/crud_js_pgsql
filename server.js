// "dev": "nodemon arquivo.js"
// executar com o comando -> npm run dev

// Utilizando framework fastify
import { fastify } from 'fastify'
// import { dbMemory } from './database-memory.js' 
import { dbPGSQL } from './database-pgsql.js'


const server = fastify()

// const database = new dbMemory()
const database = new dbPGSQL()


// Request Body
// POST 
server.post('/videos', async (request, reply) => {
    const { title, description, duration } = request.body

    await database.create({
        title,
        description,
        duration,
    })

    return reply.status(201).send()
})

// GET
server.get('/videos', async (request) => {
    const search = request.query.search

    const videos = await database.list(search)

    return videos
})

// PUT -> Atualizar(unico arquivo, passar por ID(Route.Parameter))
server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id // pegando id do video
    const { title, description, duration } = request.body

    await database.update(videoId, {
        title,
        description,
        duration,
    })

    return reply.status(204).send() // 204 -> Sucesso, pore
})

// DELETE -> Por ID novamente
server.delete('/videos/:id', async (request, reply) => {
    const videoId = request.params.id

    await database.delete(videoId)

    return reply.status(204).send()
})


// Servidor ativo
server.listen({
    port: process.env.PORT ?? 3333, // Vai rodar na porta .env, senao, porta 3333
})