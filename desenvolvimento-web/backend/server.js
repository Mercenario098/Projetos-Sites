const express = require("express");
const cors = require("cors");
require("dotenv").config();

const banco = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Rota inicial
app.get("/api/residuos", async (req, res) => {
    try {
        const nome = req.query.nome;

        // Se não informar um nome, retorna todos
        if (!nome) {
            const [residuos] = await banco.query(
                "SELECT * FROM residuos"
            );

            return res.json(residuos);
        }

        // Pesquisa pelo nome
        const [residuos] = await banco.query(
            "SELECT * FROM residuos WHERE nome LIKE ?",
            [`%${nome}%`]
        );

        if (residuos.length === 0) {
            return res.status(404).json({
                erro: "Resíduo não encontrado."
            });
        }

        res.json(residuos[0]);

    } catch (erro) {
        console.error("Erro ao consultar banco:", erro);

        res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
});

// Consulta todos os resíduos
app.get("/api/residuos", async (req, res) => {
    try {
        const [residuos] = await banco.query(
            "SELECT * FROM residuos"
        );

        res.json(residuos);

    } catch (erro) {
        console.error("Erro ao consultar banco:", erro);

        res.status(500).json({
            erro: "Erro ao consultar os resíduos."
        });
    }
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});