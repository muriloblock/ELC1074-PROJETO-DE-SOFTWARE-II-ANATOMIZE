from pprint import pprint

from src import ErroGeracaoPerguntas, gerar_perguntas

CONTEXTO = """
O sistema cardiovascular é formado pelo coração e pelos vasos sanguíneos. O coração
possui quatro câmaras: dois átrios e dois ventrículos. A circulação pulmonar conduz
o sangue do ventrículo direito aos pulmões e retorna ao átrio esquerdo. A circulação
sistêmica leva o sangue do ventrículo esquerdo aos tecidos e retorna ao átrio direito.
"""


try:
    perguntas = gerar_perguntas(CONTEXTO, quantidade=3)
    pprint(perguntas, sort_dicts=False)
except ErroGeracaoPerguntas as erro:
    print(f"Erro: {erro}")
