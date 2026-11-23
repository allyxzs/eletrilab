# EletriLab

**Laboratório Inteligente de Eletricidade** — uma bancada interativa para aprender como tensão, corrente, resistência e potência se relacionam.

Versão **1.1**. Interface em português, com fundo grafite, azul elétrico e amarelo, adaptada a celular e computador.

## Funcionalidades

- **Laboratório:** monte associações de 1 a 6 resistores, ajuste a fonte, abra ou feche a chave e veja o diagrama atualizar. Série, paralelo e misto (R1 em série com os demais em paralelo).
- **Cálculos em tempo real:** resistência equivalente, corrente total, potência e valores individuais de cada resistor.
- **Explicação do raciocínio:** fórmula, substituição dos valores e resultado com unidade.
- **Gráfico interativo:** explore a relação entre tensão e corrente mantendo a resistência constante.
- **Lei de Ohm:** seis combinações de duas grandezas conhecidas, incluindo potência; conversão de prefixos antes do cálculo.
- **Potência e energia:** consumo em kWh e estimativa de custo pela tarifa informada.
- **Unidades e fórmulas:** definições, exemplos resolvidos, leitura de diagramas e conversão de prefixos de pico a giga.
- **Aprendizagem:** exercícios numéricos gerados automaticamente e questionários conceituais com correção explicada.
- **Evolução:** 10 XP por acerto, três níveis, total de respostas e aproveitamento.
- **Histórico:** até 100 cálculos salvos manualmente, com data e exportação JSON.
- **Acessibilidade:** controles com rótulos, navegação por teclado, foco visível, descrição dos diagramas e respeito à preferência de movimento reduzido.

## Executar localmente

O app usa HTML, CSS e JavaScript puro. O `index.html` entregue já contém todo o CSS, JavaScript e ícone. Ele funciona sozinho, sem depender das pastas de código-fonte. Não há dependências externas, chaves de API, banco de dados ou fontes remotas.

Abra `index.html` em um navegador moderno. Para uma origem estável e melhor previsibilidade do armazenamento, use o servidor local opcional com Node.js 18 ou superior:

```sh
npm start
```

Acesse o endereço informado no terminal. Não é necessário executar `npm install`.

Todos os recursos do app são locais. A execução em `file://` pode ter restrições de persistência ou abertura de arquivos no navegador do celular. O funcionamento pelo servidor local ou por uma hospedagem estática usa os mesmos arquivos.

## Exemplo resolvido

Para uma fonte de **12 V** e um resistor de **6 Ω**:

1. A incógnita é a corrente I.
2. Use **I = V / R**.
3. Substitua: **I = 12 / 6**.
4. Resultado: **I = 2 A**.
5. Potência: **P = V × I = 24 W**.

Na bancada, dois resistores de 6 Ω em série resultam em 12 Ω e 1 A. Em paralelo, resultam em 3 Ω e 4 A.

## Estrutura

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Aplicação completa e autocontida, pronta para abrir |
| `src/template.html` | Estrutura usada pelo gerador da página |
| `scripts/build.cjs` | Incorpora estilos, scripts e ícone no HTML |
| `js/boot.js` | Inicialização e mensagem de recuperação |
| `js/state.js` | Validação e recuperação dos dados salvos |
| `styles.css` | Identidade visual e responsividade |
| `js/core.js` | Funções matemáticas independentes da interface |
| `js/app.js` | Telas, diagramas SVG, exercícios e persistência |
| `assets/icon.svg` | Símbolo vetorial do laboratório |
| `scripts/serve.cjs` | Servidor local opcional sem dependências |
| `tests/core.test.cjs` | Testes das fórmulas, invariantes e validação |

## Desenvolvimento

Para alterar a interface, edite `src/template.html`, `styles.css` e os arquivos de `js/`. Depois execute `npm run build` para atualizar o `index.html`. O gerador usa apenas Node.js e não requer instalação de pacotes.

## Verificação

```sh
npm test
npm run check
```

Os 14 testes cobrem página autocontida, rotas, compatibilidade com dados antigos, recuperação de dados inválidos e os seis pares da Lei de Ohm, série, paralelo, misto, conservação de potência, leis de tensão/corrente, consumo, conversões e entradas inválidas. Consulte `VALIDACAO.md` para o escopo da conferência desta versão.

## Dados e privacidade

A atualização mantém a chave e o formato dos dados da versão anterior. Quando há dados inválidos, a primeira gravação tenta preservar o texto original em uma chave `eletrilab.v1.recovery.<instante>` antes de salvar a sessão recuperada.

O estado da bancada, o histórico e o progresso são armazenados em `localStorage`, na chave `eletrilab.v1`. Não há cadastro, telemetria ou envio de dados a servidores. O histórico exportado é uma cópia para consulta; a versão 1.1 não importa arquivos.

O navegador, perfil e endereço de acesso determinam o armazenamento. Limpar os dados do site remove os registros. Quando o armazenamento está bloqueado, a aplicação continua durante a sessão e exibe a limitação no cabeçalho. O desafio em andamento não é persistido; o total de respostas e os XP são.

## Modelo e limites

- Circuitos resistivos ideais em **corrente contínua**, com uma fonte ideal e chave ideal. Valores positivos e finitos; curto-circuito por resistor de 0 Ω não é modelado.
- O circuito misto tem uma topologia definida: **R1 + (R2 ∥ R3 ∥ …)**. Não é um editor livre de fios nem um simulador SPICE.
- Sem corrente alternada, transientes, capacitores/indutores no simulador, tolerâncias, aquecimento ou fontes não ideais. Capacitância está disponível apenas no conversor.
- O gráfico representa a associação com chave fechada; isso é indicado na tela mesmo quando a chave da bancada está aberta.
- A animação mostra o sentido convencional da corrente; sua velocidade não representa a velocidade física das cargas.
- Cálculos internos em SI, usando números de ponto flutuante. A apresentação arredonda a até quatro casas decimais ou usa notação científica. Entradas aceitam ponto ou vírgula decimal, sem separador de milhar.
- Resultados fora do intervalo numérico geram erro. Valores muito extremos não são adequados à visualização didática.
- A estimativa de energia supõe potência constante. A tarifa inicial de R$ 1/kWh é ilustrativa, sem consulta a concessionárias.
- Ferramenta de estudo; não faz dimensionamento ou certificação de instalações reais. Os níveis do app não são certificações profissionais.

## Possíveis próximos módulos

Editor livre por nós, mais componentes, análise de circuitos CA, trilhas de estudo por dificuldade e importação de experimentos. Esses módulos não estão incluídos nesta versão.
