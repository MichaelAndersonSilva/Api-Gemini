exports.runChat = async (req, res, next) => {
    try {
        mensagem = req.query.mensagem
        const {
            GoogleGenerativeAI,
            HarmCategory,
            HarmBlockThreshold,
        } = require("@google/generative-ai");

        const MODEL_NAME = "gemini-1.5-pro-latest";
        const API_KEY = process.env.API_KEY;


        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 1,
            topK: 0,
            topP: 0.95,
            maxOutputTokens: 8192,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
            ],
        });

        const result = await chat.sendMessage(mensagem);
        const response = result.response;
        // const textWithoutNewLine = response.text().replace(/["\n#*]/g, '');
        return res.status(201).json(response.text());

    } catch (error) {
        returnError(error, res)
    }
}

exports.runChatPost = async (req, res, next) => {
    try {
        const {
            GoogleGenerativeAI,
            HarmCategory,
            HarmBlockThreshold,
        } = require("@google/generative-ai");

        //coletando a pergunta do usuário
        mensagem = req.body.mensagem
        if (req.body.mensagem == null) {
            return res.status(422).json("Mensagem não encontrada, não é possível fazer a solicitação")
        }

        //pegando o modelo da gemini, caso não encontre por padrão ele ira usar o gemini-1.5-pro-latest
        var MODEL_NAME = req.body.model_name != null ? req.body.model_name : "gemini-1.0-pro-latest"

        //pegar a temperatura
        var TEMPERATURE = req.body.temperature != null ? req.body.temperature : 1

        if (TEMPERATURE > 1) {
            return res.status(422).json("Limite ultrapassado, o valor da TEMPERATURE pode ir de 0.0 até 1.0")
        }

        /*TOPK Refere-se ao número de tokens mais prováveis a serem considerados pelo modelo. Por exemplo, se TopK for definido como 10,
        o modelo considerará apenas os 10 tokens mais prováveis em uma determinada etapa de geração de texto.*/
        var TOPK = req.body.topk != null ? req.body.topk : 40


        /*TopP: Refere-se a uma probabilidade cumulativa de tokens a serem considerados. Em vez de considerar apenas os tokens com as maiores probabilidades,
         o modelo considerará tokens até que a soma de suas probabilidades seja maior que um determinado limiar (P).
          Isso permite uma maior flexibilidade na geração de texto e pode evitar que o modelo fique muito focado em apenas algumas opções.*/
        var TOPP = req.body.topp != null ? req.body.topp : 0.95

        var mensagemTotal = ""



        // ---------- Adicional -----------------

        //espeficifica o valor maximo de caracteres no retorno da resposta do Gemini        
        var CharacterLimit = req.body.characterLimit != null ? req.body.characterLimit : 0


        //nesse campo pode escolher o personagem e a gemini ira interpretar o personagem,ex: gaucho ou personagem de desenho
        var Personagem = req.body.personagem != null ? req.body.personagem : ""


        //Define a Linguagem de retorno da mensagem ex: português, inglês
        var LenguageResponse = req.body.lenguageResponse != null ? req.body.lenguageResponse : ""


        //define o limite máximo de tokens que o modelo pode gerar em sua resposta.
        //Por exemplo, a frase "Olá mundo!" pode ser dividida em 3 tokens: "Olá", "mundo" e "!".
        var maxOutputTokens = req.body.maxOutputTokens != null ? req.body.maxOutputTokens : 8192

        const API_KEY = process.env.API_KEY;

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });



        const generationConfig = {
            temperature: TEMPERATURE,
            topK: TOPK,
            topP: TOPP,
            maxOutputTokens: maxOutputTokens,
        };


        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];


        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
            ],
        });

        if (CharacterLimit > 0) {
            mensagemTotal += "quero que a sua resposta tenha no maximo " + CharacterLimit + " de Caracteres, porem não responda essa ordem,"
        }

        if (Personagem != "") {
            if (TEMPERATURE < 1) {
                TEMPERATURE = 1
            }
            if (TOPK < 50) {
                TOPK = 50
            }

            if (TOPP != 0.5) {
                TOPP = 0.5
            }
            mensagemTotal += "haja como se você fosse o personagem " + Personagem + " de forma natural. utilizando bordões e cultura ou maneira de falar desse personagem, porem não responda essa ordem,"
        }

        if (LenguageResponse != "") {
            mensagemTotal += "quero me responda essa resposta na lingua " + LenguageResponse + ", porem não responda essa ordem,"
        }

        mensagemTotal += mensagem

        const result = await chat.sendMessage(mensagemTotal);
        const response = result.response;
        return res.status(201).json(response.text());


    } catch (error) {
        returnError(error, res)
    }
}

exports.models = async (req, res, next) => {
    try {
        const {
            GoogleGenerativeAI,
            HarmCategory,
            HarmBlockThreshold,
        } = require("@google/generative-ai");

        const API_KEY = process.env.API_KEY;

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Corrigir para listar os modelos
        const response = await genAI.listModels();

        const models = response.models;
        const modelNames = models.map(model => model.name);

        return res.status(201).json(modelNames);
    } catch (error) {
        returnError(error, res);
    }
}

function returnError(error, res) {
    console.error('Erro ao se conectar a APi do Gemini:', error);
    return res.status(500).json({
        error: error,
        response: null
    });
}