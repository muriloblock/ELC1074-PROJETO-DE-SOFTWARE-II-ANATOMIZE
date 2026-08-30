# ELC1074-PROJETO-DE-SOFTWARE-II

## Definição do tema

Jogo a modo de ¨Trivia¨que use Inteligência artificial, onde os estudantes carreguem uma unidade em formato pdf, e o software elabore perguntas de Anatomia sistémica para o aluno carregar um áudio com a resposta, o software avalia a resposta e pontua com uma qualificação, oferecendo ao mesmo tempo uma retroalimentação de uma resposta 10 de 10. Serve para preparação das provas semestrais teóricas e desenvolver expressão oral sem a pressão de uma prova presencial.  

## Divisão de tarefas

1 - Frontend e interface do jogo:

- Tecnologia:
- Sugestão de tecnologia: Html, css e javascript. Não vejo necessidade de framework como React.

2 - Banco de dados, autenticação e salvamento de PDF:

- Tecnologia:
- Sugestão de tecnologia: Supabase ou firebase, tem serviços gratuitos que poupam esse desenvolvimento de autenticação e banco de dados

3 - IA para geração de perguntas e avaliação (Murilo):

- Tecnologia: 
- Tecnologia: Python e API do Groq

4 - Transcrição de áudio:

- Tecnologia:
- Sugestão de tecnologia: grog cloud ou gemini

5 - Hospedagem e deploy

- Tecnologia:
- Sugestão: vercel, render, netlify

## Geração de perguntas (Murilo)

O módulo em `src/gerador_perguntas.py` recebe o texto já extraído de um PDF e
gera perguntas discursivas estruturadas. A leitura do arquivo PDF ficará a cargo
de outro componente do sistema.

### Contrato do módulo

```python
from src import gerar_perguntas

perguntas = gerar_perguntas(contexto, quantidade=3)
```

Cada pergunta possui o seguinte formato:

```json
{
  "id": 1,
  "enunciado": "Texto da pergunta",
  "respostaEsperada": "Resposta completa baseada no contexto",
  "topicosChave": ["conceito 1", "conceito 2"],
  "dificuldade": "básica"
}
```

### Como executar

É necessário ter o Python 3.10 ou superior e uma chave da API do Groq. A chave
deve existir apenas no backend; ela não pode ser incluída no código do frontend.

Crie um arquivo `.env` com:

```env
GROQ_API_KEY=sua_chave
```

No PowerShell:

```powershell
python -m pip install -r requirements.txt
python -m examples.gerar_perguntas
```
