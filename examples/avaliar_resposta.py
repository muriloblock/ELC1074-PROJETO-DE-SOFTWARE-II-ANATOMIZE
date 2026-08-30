from pprint import pprint

from src import ErroAvaliacaoResposta, avaliar_resposta

PERGUNTA = {
    "id": 1,
    "enunciado": "Como ocorre a circulação pulmonar?",
    "respostaEsperada": (
        "O sangue sai do ventrículo direito, passa pelos pulmões e retorna ao "
        "átrio esquerdo."
    ),
    "topicosChave": [
        "ventrículo direito",
        "pulmões",
        "átrio esquerdo",
    ],
    "dificuldade": "intermediária",
}

RESPOSTAS_TRANSCRITAS = [
    {
        "descricao": "Resposta completa",
        "texto": (
            "O sangue sai do ventrículo direito, vai até os pulmões e depois "
            "retorna ao átrio esquerdo."
        ),
    },
    {
        "descricao": "Resposta parcial",
        "texto": (
            "O sangue sai do ventrículo e depois volta para o átrio esquerdo."
        ),
    },
    {
        "descricao": "Resposta incorreta",
        "texto": (
            "O sangue sai do ventrículo esquerdo, passa pelos tecidos e volta "
            "ao átrio direito."
        ),
    },
]


for numero, resposta in enumerate(RESPOSTAS_TRANSCRITAS, start=1):
    print(f"\n--- Avaliação {numero}: {resposta['descricao']} ---")

    try:
        avaliacao = avaliar_resposta(PERGUNTA, resposta["texto"])
        print(f"Resposta do aluno: {resposta['texto']}\n")
        pprint(avaliacao, sort_dicts=False)
    except ErroAvaliacaoResposta as erro:
        print(f"Erro: {erro}")
