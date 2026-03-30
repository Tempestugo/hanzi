/**
 * seed.ts — Popula o banco MySQL com dados iniciais
 *
 * Como rodar:
 *   npx tsx seed.ts
 *
 * Pré-requisitos:
 *   1. Rode schema.sql no phpMyAdmin primeiro
 *   2. Configure o arquivo .env na raiz do projeto
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection({
  host:     process.env.DB_HOST     ?? "localhost",
  user:     process.env.DB_USER     ?? "",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME     ?? "",
  port:     Number(process.env.DB_PORT ?? 3306),
  charset:  "utf8mb4",
  multipleStatements: false,
});

// ============================================================
// DADOS
// ============================================================

const MODULES = [
  { title: "Pictogramas — quando o desenho virou escrita",   slug: "pictogramas",          description: "Os primeiros caracteres chineses nasceram de desenhos diretos do mundo natural. Aqui você entende como um traço simples carrega milênios de observação humana.",                     order_index: 1 },
  { title: "Ideogramas compostos — a lógica da combinação",  slug: "ideogramas-compostos", description: "Quando dois caracteres se fundem para criar um significado novo. A poesia visual da escrita chinesa em sua forma mais elegante.",                                                    order_index: 2 },
  { title: "Compostos fono-semânticos — o sistema oculto",   slug: "fono-semanticos",      description: "90% dos caracteres seguem um padrão que a maioria ignora: uma parte indica o significado, outra indica o som. Descobrir isso muda tudo.",                                           order_index: 3 },
  { title: "Ideogramas simples — abstrações em traços",      slug: "ideogramas-simples",   description: "Como representar conceitos abstratos — acima, abaixo, um, dois — usando apenas linhas? A solução chinesa é elegantemente direta.",                                                   order_index: 4 },
];

const CHARACTERS = [
  // Pictogramas
  { hanzi: "日", pinyin: "rì",    tone_number: 4, meaning_pt: "Sol; dia",              radical: "日", stroke_count: 4,  category: "pictogram",          hsk_level: "1", slug: "ri-sol"       },
  { hanzi: "月", pinyin: "yuè",   tone_number: 4, meaning_pt: "Lua; mês",              radical: "月", stroke_count: 4,  category: "pictogram",          hsk_level: "1", slug: "yue-lua"      },
  { hanzi: "木", pinyin: "mù",    tone_number: 4, meaning_pt: "Árvore; madeira",       radical: "木", stroke_count: 4,  category: "pictogram",          hsk_level: "1", slug: "mu-arvore"    },
  { hanzi: "山", pinyin: "shān",  tone_number: 1, meaning_pt: "Montanha",              radical: "山", stroke_count: 3,  category: "pictogram",          hsk_level: "1", slug: "shan-montanha"},
  { hanzi: "水", pinyin: "shuǐ",  tone_number: 3, meaning_pt: "Água",                  radical: "水", stroke_count: 4,  category: "pictogram",          hsk_level: "1", slug: "shui-agua"    },
  { hanzi: "火", pinyin: "huǒ",   tone_number: 3, meaning_pt: "Fogo",                  radical: "火", stroke_count: 4,  category: "pictogram",          hsk_level: "2", slug: "huo-fogo"     },
  { hanzi: "人", pinyin: "rén",   tone_number: 2, meaning_pt: "Pessoa; ser humano",    radical: "人", stroke_count: 2,  category: "pictogram",          hsk_level: "1", slug: "ren-pessoa"   },
  { hanzi: "口", pinyin: "kǒu",   tone_number: 3, meaning_pt: "Boca; entrada",         radical: "口", stroke_count: 3,  category: "pictogram",          hsk_level: "1", slug: "kou-boca"     },
  { hanzi: "目", pinyin: "mù",    tone_number: 4, meaning_pt: "Olho",                  radical: "目", stroke_count: 5,  category: "pictogram",          hsk_level: "3", slug: "mu-olho"      },
  { hanzi: "手", pinyin: "shǒu",  tone_number: 3, meaning_pt: "Mão",                   radical: "手", stroke_count: 4,  category: "pictogram",          hsk_level: "2", slug: "shou-mao"     },
  { hanzi: "门", pinyin: "mén",   tone_number: 2, meaning_pt: "Porta; portão",         radical: "门", stroke_count: 3,  category: "pictogram",          hsk_level: "1", slug: "men-porta"    },
  { hanzi: "田", pinyin: "tián",  tone_number: 2, meaning_pt: "Campo; arrozal",        radical: "田", stroke_count: 5,  category: "pictogram",          hsk_level: "3", slug: "tian-campo"   },
  { hanzi: "女", pinyin: "nǚ",    tone_number: 3, meaning_pt: "Mulher; feminino",      radical: "女", stroke_count: 3,  category: "pictogram",          hsk_level: "1", slug: "nu-mulher"    },
  { hanzi: "子", pinyin: "zǐ",    tone_number: 3, meaning_pt: "Filho; criança",        radical: "子", stroke_count: 3,  category: "pictogram",          hsk_level: "2", slug: "zi-filho"     },
  // Ideogramas simples
  { hanzi: "一", pinyin: "yī",    tone_number: 1, meaning_pt: "Um",                    radical: "一", stroke_count: 1,  category: "simple_ideogram",    hsk_level: "1", slug: "yi-um"        },
  { hanzi: "二", pinyin: "èr",    tone_number: 4, meaning_pt: "Dois",                  radical: "二", stroke_count: 2,  category: "simple_ideogram",    hsk_level: "1", slug: "er-dois"      },
  { hanzi: "三", pinyin: "sān",   tone_number: 1, meaning_pt: "Três",                  radical: "一", stroke_count: 3,  category: "simple_ideogram",    hsk_level: "1", slug: "san-tres"     },
  { hanzi: "上", pinyin: "shàng", tone_number: 4, meaning_pt: "Acima; subir",          radical: "一", stroke_count: 3,  category: "simple_ideogram",    hsk_level: "1", slug: "shang-acima"  },
  { hanzi: "下", pinyin: "xià",   tone_number: 4, meaning_pt: "Abaixo; descer",        radical: "一", stroke_count: 3,  category: "simple_ideogram",    hsk_level: "1", slug: "xia-abaixo"   },
  { hanzi: "中", pinyin: "zhōng", tone_number: 1, meaning_pt: "Centro; meio; China",   radical: "丨", stroke_count: 4,  category: "simple_ideogram",    hsk_level: "1", slug: "zhong-centro" },
  // Ideogramas compostos
  { hanzi: "林", pinyin: "lín",   tone_number: 2, meaning_pt: "Bosque",                radical: "木", stroke_count: 8,  category: "compound_ideogram",  hsk_level: "3", slug: "lin-bosque"   },
  { hanzi: "森", pinyin: "sēn",   tone_number: 1, meaning_pt: "Floresta densa",        radical: "木", stroke_count: 12, category: "compound_ideogram",  hsk_level: "4", slug: "sen-floresta" },
  { hanzi: "明", pinyin: "míng",  tone_number: 2, meaning_pt: "Brilhante; claro",      radical: "日", stroke_count: 8,  category: "compound_ideogram",  hsk_level: "2", slug: "ming-brilhante"},
  { hanzi: "好", pinyin: "hǎo",   tone_number: 3, meaning_pt: "Bom; bem",              radical: "女", stroke_count: 6,  category: "compound_ideogram",  hsk_level: "1", slug: "hao-bom"      },
  { hanzi: "休", pinyin: "xiū",   tone_number: 1, meaning_pt: "Descansar; parar",      radical: "人", stroke_count: 6,  category: "compound_ideogram",  hsk_level: "2", slug: "xiu-descansar"},
  { hanzi: "家", pinyin: "jiā",   tone_number: 1, meaning_pt: "Casa; família; lar",    radical: "宀", stroke_count: 10, category: "compound_ideogram",  hsk_level: "1", slug: "jia-familia"  },
  { hanzi: "安", pinyin: "ān",    tone_number: 1, meaning_pt: "Paz; segurança",        radical: "宀", stroke_count: 6,  category: "compound_ideogram",  hsk_level: "3", slug: "an-paz"       },
  // Fono-semânticos
  { hanzi: "妈", pinyin: "mā",    tone_number: 1, meaning_pt: "Mãe",                   radical: "女", stroke_count: 6,  category: "phono_semantic",     hsk_level: "1", slug: "ma-mae"       },
  { hanzi: "语", pinyin: "yǔ",    tone_number: 3, meaning_pt: "Língua; idioma",        radical: "讠", stroke_count: 9,  category: "phono_semantic",     hsk_level: "1", slug: "yu-idioma"    },
  { hanzi: "清", pinyin: "qīng",  tone_number: 1, meaning_pt: "Limpo; claro; puro",    radical: "氵", stroke_count: 11, category: "phono_semantic",     hsk_level: "3", slug: "qing-limpo"   },
  { hanzi: "情", pinyin: "qíng",  tone_number: 2, meaning_pt: "Sentimento; emoção",    radical: "忄", stroke_count: 11, category: "phono_semantic",     hsk_level: "3", slug: "qing-sentimento"},
  { hanzi: "请", pinyin: "qǐng",  tone_number: 3, meaning_pt: "Por favor; convidar",   radical: "讠", stroke_count: 10, category: "phono_semantic",     hsk_level: "1", slug: "qing-porfavor"},
];

// Posts com conteúdo completo (8 caracteres)
type PostData = {
  slug: string;
  title: string;
  etymology: string;
  stages: { era: string; label: string; description: string; approx_year: string }[];
  composition: string;
  mnemonic: string;
  examples: { hanzi: string; pinyin: string; meaning_pt: string }[];
};

const POSTS: PostData[] = [
  {
    slug: "ri-sol",
    title: "日 — O Sol que se tornou um quadrado",
    etymology: `## Por que o sol é um quadrado?\n\nÀ primeira vista, 日 não parece um sol. Mas olhe para as escritas mais antigas — nos ossos oraculares da Dinastia Shang (séc. XIII a.C.), o caractere era um círculo perfeito com um ponto no centro, como fazem as crianças quando desenham o sol hoje.\n\nCom o passar dos séculos, a escrita foi se adaptando ao bambu e depois ao pincel. Curvas se tornam linhas retas. O círculo vira um retângulo. O ponto central se transforma em uma linha horizontal — mais fácil de traçar com um pincel em movimento vertical.\n\n## 日 como radical\n\nPor ser tão fundamental, 日 aparece em dezenas de outros caracteres como componente semântico:\n\n- **明** (míng) — brilhante: sol + lua juntos\n- **晴** (qíng) — tempo bom: sol sobre o azul\n- **早** (zǎo) — cedo: sol acima do horizonte\n- **星** (xīng) — estrela: pequenos sóis no céu noturno`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Círculo com ponto central. Ossos oraculares.",       approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "Oval achatado. Inscrições em bronze.",               approx_year: "1000 a.C." },
      { era: "zhuanshu",  label: "篆書 Zhuànshū",    description: "Retângulo arredondado. Escrita de sigilo.",          approx_year: "221 a.C."  },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "Forma moderna: retângulo com linha central.",        approx_year: "200 d.C."  },
    ],
    composition: "日 é um pictograma puro e radical independente. Presente como componente em mais de 60 caracteres ligados a luz, tempo e calor.",
    mnemonic: "Um sol desenhado por uma criança: círculo com ponto no meio. O tempo transformou o círculo em quadrado, mas o ponto ainda está lá — agora como a linha horizontal dentro de 日.",
    examples: [
      { hanzi: "日本",  pinyin: "Rìběn",   meaning_pt: "Japão (origem do sol)" },
      { hanzi: "今日",  pinyin: "jīnrì",   meaning_pt: "hoje" },
      { hanzi: "日记",  pinyin: "rìjì",    meaning_pt: "diário" },
      { hanzi: "明日",  pinyin: "míngrì",  meaning_pt: "amanhã" },
      { hanzi: "日出",  pinyin: "rìchū",   meaning_pt: "nascer do sol" },
    ],
  },
  {
    slug: "yue-lua",
    title: "月 — A Lua que também virou retângulo",
    etymology: `## Irmã de 日, mesma história\n\n月 e 日 são inseparáveis. Nos ossos oraculares, a lua era uma meia-lua crescente realista — a forma côncava que vemos no céu noturno. A mesma pressão que transformou o círculo solar em quadrado agiu sobre a crescente lunar: as curvas cederam ao pincel.\n\n## Dupla função: lua e mês\n\nEm chinês, 月 cobre dois conceitos que o português separa: é a lua no céu e também a unidade de tempo "mês" — afinal, um mês é o ciclo completo da lua. Essa ambiguidade não é um bug, é uma feature.\n\n## Como radical\n\n月 como radical aparece em caracteres ligados ao corpo (às vezes na forma 肉, "carne"):\n- **胸** (xiōng) — peito\n- **脸** (liǎn) — rosto\n- **脚** (jiǎo) — pé`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Crescente lunar com estrela interna.",               approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "Crescente estilizada.",                              approx_year: "1000 a.C." },
      { era: "zhuanshu",  label: "篆書 Zhuànshū",    description: "Oval com dois traços internos.",                    approx_year: "221 a.C."  },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "Retângulo moderno com dois traços horizontais.",    approx_year: "200 d.C."  },
    ],
    composition: "月 é pictograma puro. Juntos, 日 + 月 formam 明 (brilhante) — a combinação do sol e da lua representa o brilho máximo.",
    mnemonic: "Pense na lua crescente — aquela fatia fina no céu. 月 guarda a memória dessa forma nos seus dois traços internos.",
    examples: [
      { hanzi: "月亮",  pinyin: "yuèliàng",  meaning_pt: "a lua (brilhante)" },
      { hanzi: "月份",  pinyin: "yuèfèn",    meaning_pt: "mês" },
      { hanzi: "上月",  pinyin: "shàngyuè",  meaning_pt: "mês passado" },
      { hanzi: "月饼",  pinyin: "yuèbǐng",   meaning_pt: "pastel da lua" },
      { hanzi: "岁月",  pinyin: "suìyuè",    meaning_pt: "anos e meses; tempo" },
    ],
  },
  {
    slug: "mu-arvore",
    title: "木 — A árvore que gerou uma floresta de palavras",
    etymology: `## O desenho mais literal da natureza\n\n木 é talvez o pictograma mais intuitivo da escrita chinesa. Nos ossos oraculares, o caractere mostrava exatamente o que era: um tronco vertical, ramos se abrindo para cima, e raízes se espalhando para baixo. Hoje, esses elementos ainda estão todos ali.\n\n## Uma família de caracteres\n\n木 é um dos radicais mais produtivos. Porque madeira e árvores eram centrais para a vida — construção, ferramentas, móveis, combustível — dezenas de palavras precisavam do componente 木:\n\n| Caractere | Pronúncia | Significado |\n|-----------|-----------|-------------|\n| 林 | lín | bosque (2 árvores) |\n| 森 | sēn | floresta (3 árvores) |\n| 桌 | zhuō | mesa (de madeira) |\n| 椅 | yǐ | cadeira |\n| 根 | gēn | raiz |`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Árvore esquemática: tronco, galhos, raízes.",       approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "Forma mais simétrica e estilizada.",                approx_year: "1000 a.C." },
      { era: "zhuanshu",  label: "篆書 Zhuànshū",    description: "Raízes e galhos curvilíneos.",                      approx_year: "221 a.C."  },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "4 traços: tronco + galhos + raízes.",              approx_year: "200 d.C."  },
    ],
    composition: "木 é pictograma puro e um dos 214 radicais Kangxi. Indica relação com madeira, árvores ou objetos de madeira.",
    mnemonic: "Veja a árvore dentro do caractere: traço vertical = tronco, horizontal = galhos, diagonais inferiores = raízes.",
    examples: [
      { hanzi: "木头",  pinyin: "mùtou",   meaning_pt: "pedaço de madeira" },
      { hanzi: "树木",  pinyin: "shùmù",   meaning_pt: "árvores" },
      { hanzi: "木工",  pinyin: "mùgōng",  meaning_pt: "carpinteiro" },
      { hanzi: "积木",  pinyin: "jīmù",    meaning_pt: "blocos de montar" },
      { hanzi: "朽木",  pinyin: "xiǔmù",   meaning_pt: "madeira podre" },
    ],
  },
  {
    slug: "lin-bosque",
    title: "林 — Quando duas árvores formam um bosque",
    etymology: `## A matemática mais poética da escrita\n\n林 é a prova de que a escrita chinesa tem uma lógica interna elegante. Precisa representar "muitas árvores"? Ponha duas árvores juntas: 木 + 木 = 林.\n\nEssa estrutura, chamada de ideograma composto (會意字), é uma das marcas mais características da escrita chinesa. O significado não é arbitrário — ele surge diretamente da composição visual.\n\n## A sequência 木 → 林 → 森\n\n- **木** (mù) — uma árvore\n- **林** (lín) — duas árvores: um bosque, algo manejável\n- **森** (sēn) — três árvores: floresta densa, sombria, intimidadora\n\n林 também é um sobrenome muito comum — o Lin/Lim das diásporas asiáticas significa, literalmente, bosque.`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Duas árvores lado a lado, realistas.",              approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "As duas árvores se estilizam juntas.",              approx_year: "1000 a.C." },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "Forma moderna: 木 + 木, lado a lado.",             approx_year: "200 d.C."  },
    ],
    composition: "林 = 木 (árvore) + 木 (árvore). A árvore da esquerda é comprimida para caber junto da direita — padrão comum em compostos.",
    mnemonic: "Simples: duas árvores fazem um bosque. Se você lembra de 木, já lembra de 林.",
    examples: [
      { hanzi: "森林",  pinyin: "sēnlín",   meaning_pt: "floresta" },
      { hanzi: "林业",  pinyin: "línyè",    meaning_pt: "silvicultura" },
      { hanzi: "竹林",  pinyin: "zhúlín",   meaning_pt: "bosque de bambu" },
      { hanzi: "林立",  pinyin: "línlì",    meaning_pt: "em pé como árvores numa floresta" },
    ],
  },
  {
    slug: "ming-brilhante",
    title: "明 — Sol + Lua = o brilho máximo",
    etymology: `## A mais bela equação da escrita chinesa\n\n明 é um ideograma composto que dispensa explicação: 日 (sol) + 月 (lua) = brilhante, claro, luminoso. Quando as duas maiores fontes de luz se juntam, o resultado só pode ser claridade total.\n\nMas 明 vai além da luz física. Em chinês, 明 também significa *inteligente*, *perspicaz*, *que enxerga claramente*. Quem é 聪明 (cōngmíng) é literalmente alguém cuja mente é tão iluminada quanto o sol e a lua juntos.\n\n## 明 na história\n\nA Dinastia Ming (明朝, 1368–1644) escolheu esse caractere como nome dinástico — uma declaração de poder e clareza civilizacional. Foi sob os Ming que a China construiu a Grande Muralha em sua forma atual.`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Sol e lua lado a lado, formas arredondadas.",       approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "O sol aparece dentro de uma janela.",               approx_year: "1000 a.C." },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "Forma moderna: 日 à esquerda + 月 à direita.",     approx_year: "200 d.C."  },
    ],
    composition: "明 = 日 (sol) + 月 (lua). Ideograma composto clássico onde ambos contribuem com significado. O 日 é comprimido à esquerda.",
    mnemonic: "Sol e lua juntos: a luz máxima possível. Quando o dia e a noite se unem, tudo fica 明 — brilhante, claro, evidente.",
    examples: [
      { hanzi: "明白",  pinyin: "míngbái",   meaning_pt: "entender; estar claro" },
      { hanzi: "明天",  pinyin: "míngtiān",  meaning_pt: "amanhã" },
      { hanzi: "聪明",  pinyin: "cōngmíng",  meaning_pt: "inteligente" },
      { hanzi: "明星",  pinyin: "míngxīng",  meaning_pt: "estrela; celebridade" },
      { hanzi: "光明",  pinyin: "guāngmíng", meaning_pt: "luz; brilhante; esperançoso" },
    ],
  },
  {
    slug: "hao-bom",
    title: "好 — Mulher + Filho = Bom",
    etymology: `## Uma janela para a China antiga\n\n好 é um dos ideogramas compostos mais comentados da escrita chinesa. A lógica é: 女 (mulher) + 子 (filho) = 好 (bom).\n\nA interpretação mais aceita: o caractere reflete os valores da China agrária, onde uma mulher com filhos era o símbolo de uma família próspera. O "bem" aqui não é uma declaração sobre gênero, mas sobre o que a sociedade considerava o estado ideal de um lar.\n\n## 好 em diferentes usos\n\nA versatilidade de 好 é impressionante:\n- Adjetivo: 好人 (hǎo rén) — boa pessoa\n- Advérbio: 好快 (hǎo kuài) — muito rápido  \n- Verbo: 好学 (hào xué) — gostar de estudar (tom muda para hào!)`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Figura feminina ao lado de uma criança.",           approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "Componentes começam a se estilizar.",               approx_year: "1000 a.C." },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "Forma moderna: 女 à esquerda + 子 à direita.",     approx_year: "200 d.C."  },
    ],
    composition: "好 = 女 (mulher) + 子 (filho/criança). O 女 à esquerda está inclinado e comprimido — padrão quando 女 aparece como radical esquerdo.",
    mnemonic: "Pense em uma mãe com seu filho: a cena mais universal de bem-estar. Os chineses condensaram esse sentimento em dois traços simples.",
    examples: [
      { hanzi: "好吃",  pinyin: "hǎochī",    meaning_pt: "delicioso" },
      { hanzi: "好看",  pinyin: "hǎokàn",    meaning_pt: "bonito; interessante" },
      { hanzi: "好久",  pinyin: "hǎojiǔ",    meaning_pt: "muito tempo" },
      { hanzi: "好像",  pinyin: "hǎoxiàng",  meaning_pt: "parecer; como se" },
      { hanzi: "你好",  pinyin: "nǐhǎo",     meaning_pt: "olá (literalmente: você-bem)" },
    ],
  },
  {
    slug: "jia-familia",
    title: "家 — Por que tem um porco dentro da sua casa?",
    etymology: `## O porco que mora no telhado\n\n家 é um dos caracteres mais curiosos da história cultural chinesa. Analise seus componentes: 宀 (telhado) + 豕 (porco). Literalmente: um porco debaixo de um teto.\n\nNa China agrária, o porco era o animal doméstico central. Ele consumia os restos alimentares da família, fornecia carne e gordura, e representava segurança para o inverno. Uma família com porcos em casa era uma família que ia sobreviver.\n\nA presença do porco debaixo do teto era tão sinônimo de "lar próspero" que os escribas a usaram para representar o próprio conceito de família.\n\n## 家 hoje\n\nNinguém pensa em porcos ao dizer 家. A palavra simplesmente significa lar, família — e carrega uma profundidade emocional que vai além do endereço físico.`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Porco claramente desenhado sob teto triangular.",   approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "Telhado e porco se estilizam, porco ainda visível.",approx_year: "1000 a.C." },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "宀 (teto) sobre 豕 (porco estilizado).",           approx_year: "200 d.C."  },
    ],
    composition: "家 = 宀 (radical do teto) + 豕 (porco). O radical 宀 aparece também em: 安 (paz), 室 (quarto), 宫 (palácio), 宿 (pernoitar).",
    mnemonic: "Um porco (豕) debaixo do teto (宀) = família segura e próspera = 家. Na China antiga, ter porco em casa era ter tudo.",
    examples: [
      { hanzi: "家人",  pinyin: "jiārén",   meaning_pt: "familiares" },
      { hanzi: "回家",  pinyin: "huíjiā",   meaning_pt: "voltar para casa" },
      { hanzi: "家乡",  pinyin: "jiāxiāng", meaning_pt: "cidade natal" },
      { hanzi: "家具",  pinyin: "jiājù",    meaning_pt: "móveis" },
      { hanzi: "大家",  pinyin: "dàjiā",    meaning_pt: "todos; todo mundo" },
    ],
  },
  {
    slug: "ma-mae",
    title: "妈 — Mãe: o sentido vem da mulher, o som vem do cavalo",
    etymology: `## O sistema que a maioria ignora\n\n妈 (mā) é o exemplo perfeito para entender os compostos fono-semânticos — o tipo de caractere que representa 90% do vocabulário chinês escrito.\n\nO princípio: um componente dá o **significado**, outro dá o **som**.\n\nEm 妈:\n- **女** (nǚ, mulher) — componente semântico. Indica relação com o feminino.\n- **马** (mǎ, cavalo) — componente fonético. Indica que a pronúncia é próxima de "mǎ".\n\nO resultado: mā (mãe). O tom mudou (3º → 1º), mas o som base "ma" foi preservado.\n\n## A família do som "ma"\n\n- **骂** (mà) — xingar (口 boca + 马 cavalo)\n- **码** (mǎ) — código, número (石 pedra + 马 cavalo)\n- **蚂** (mǎ) — em 蚂蚁 (formiga) (虫 inseto + 马 cavalo)`,
    stages: [
      { era: "traditional", label: "Forma clássica 媽", description: "Caractere tradicional, usado em Taiwan.",        approx_year: "pré-1949" },
      { era: "simplified",  label: "Forma simplificada 妈", description: "Reforma de 1956: 馬 simplificado para 马.", approx_year: "1956"    },
    ],
    composition: "妈 = 女 (radical semântico: mulher) + 马 (fonético: som 'mǎ'). Estrutura 左形右声: forma à esquerda, som à direita.",
    mnemonic: "Mulher (女) que soa como cavalo (马) = mãe (妈). Separe as partes: 女 dá o significado feminino, 马 dá o som 'ma'.",
    examples: [
      { hanzi: "妈妈",  pinyin: "māma",   meaning_pt: "mamãe" },
      { hanzi: "妈咪",  pinyin: "māmī",   meaning_pt: "mamãe (carinhoso)" },
      { hanzi: "老妈",  pinyin: "lǎomā",  meaning_pt: "mãe (coloquial)" },
    ],
  },
  {
    slug: "shang-acima",
    title: "上 — Uma linha acima da linha",
    etymology: `## A abstração mais direta possível\n\nComo representar "acima" com traços? Os escribas usaram a solução mais óbvia: desenhe uma linha de referência horizontal, e coloque um elemento acima dela.\n\nNos ossos oraculares, 上 era literalmente um ponto acima de uma linha. Com o tempo, o ponto virou um traço vertical. O conceito continua idêntico.\n\n## Mais que uma direção\n\nEm chinês moderno, 上 é muito mais versátil:\n\n- **Direção**: 上面 (shàngmiàn) — a parte de cima\n- **Movimento**: 上去 (shàngqù) — subir\n- **Sequência**: 上个月 — o mês passado (o mês "anterior" na sequência)\n- **Início**: 上课 (shàng kè) — começar a aula\n- **Complemento verbal**: 爱上 (àishàng) — apaixonar-se`,
    stages: [
      { era: "jiaguwen",  label: "甲骨文 Jiǎgǔwén", description: "Ponto acima de uma linha horizontal.",              approx_year: "1250 a.C." },
      { era: "jinwen",    label: "金文 Jīnwén",      description: "Ponto vira traço curto vertical.",                  approx_year: "1000 a.C." },
      { era: "kaishu",    label: "楷書 Kǎishū",      description: "Forma moderna: vertical + horizontal curto + base.",approx_year: "200 d.C."  },
    ],
    composition: "上 é um ideograma simples (指事字): a posição do elemento acima da linha de referência é o próprio significado. Par complementar: 下 (xià, abaixo).",
    mnemonic: "A linha no meio é o horizonte. O traço acima é tudo que está 上 — cima, norte, o que veio antes de você.",
    examples: [
      { hanzi: "上面",  pinyin: "shàngmiàn",  meaning_pt: "a parte de cima" },
      { hanzi: "上班",  pinyin: "shàngbān",   meaning_pt: "ir trabalhar" },
      { hanzi: "上课",  pinyin: "shàngkè",    meaning_pt: "ter aula" },
      { hanzi: "以上",  pinyin: "yǐshàng",    meaning_pt: "acima de; mais de" },
      { hanzi: "上海",  pinyin: "Shànghǎi",   meaning_pt: "Xangai (sobre o mar)" },
    ],
  },
];

// Relações de componentes
const RELATIONS = [
  { parent: "lin-bosque",    child: "mu-arvore",    role: "semantic", position: "left"   },
  { parent: "lin-bosque",    child: "mu-arvore",    role: "semantic", position: "right"  },
  { parent: "sen-floresta",  child: "mu-arvore",    role: "semantic", position: "top"    },
  { parent: "sen-floresta",  child: "lin-bosque",   role: "semantic", position: "bottom" },
  { parent: "ming-brilhante",child: "ri-sol",       role: "semantic", position: "left"   },
  { parent: "ming-brilhante",child: "yue-lua",      role: "semantic", position: "right"  },
  { parent: "hao-bom",       child: "nu-mulher",    role: "semantic", position: "left"   },
  { parent: "hao-bom",       child: "zi-filho",     role: "semantic", position: "right"  },
  { parent: "ma-mae",        child: "nu-mulher",    role: "semantic", position: "left"   },
];

// ============================================================
// SEED RUNNER
// ============================================================
async function seed() {
  console.log("🌱 Iniciando seed MySQL...\n");

  // 1. Módulos
  console.log("📦 Inserindo módulos...");
  for (const m of MODULES) {
    await db.execute(
      `INSERT INTO modules (title, slug, description, order_index)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description)`,
      [m.title, m.slug, m.description, m.order_index]
    );
  }
  const [moduleRows] = await db.query("SELECT id, slug FROM modules") as any;
  const moduleMap = new Map<string, number>(moduleRows.map((r: any) => [r.slug, r.id]));
  console.log(`   ✓ ${MODULES.length} módulos\n`);

  // 2. Caracteres
  console.log("🈶 Inserindo caracteres...");
  for (const c of CHARACTERS) {
    await db.execute(
      `INSERT INTO characters (hanzi, pinyin, tone_number, meaning_pt, radical, stroke_count, category, hsk_level, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE pinyin=VALUES(pinyin), meaning_pt=VALUES(meaning_pt)`,
      [c.hanzi, c.pinyin, c.tone_number, c.meaning_pt, c.radical, c.stroke_count, c.category, c.hsk_level, c.slug]
    );
  }
  const [charRows] = await db.query("SELECT id, slug, category FROM characters") as any;
  const charMap = new Map<string, { id: number; category: string }>(
    charRows.map((r: any) => [r.slug, { id: r.id, category: r.category }])
  );
  console.log(`   ✓ ${CHARACTERS.length} caracteres\n`);

  // Mapa categoria → módulo
  const catToModule: Record<string, string> = {
    pictogram:          "pictogramas",
    simple_ideogram:    "ideogramas-simples",
    compound_ideogram:  "ideogramas-compostos",
    phono_semantic:     "fono-semanticos",
  };

  // 3. Posts
  console.log("📝 Inserindo posts...");
  let postCount = 0;
  for (const p of POSTS) {
    const char = charMap.get(p.slug);
    if (!char) { console.warn(`   ⚠ Caractere não achado: ${p.slug}`); continue; }
    const moduleId = moduleMap.get(catToModule[char.category]) ?? null;

    await db.execute(
      `INSERT INTO character_posts
         (character_id, module_id, title, etymology_content, evolution_stages, composition_notes, mnemonic, example_words, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        char.id,
        moduleId,
        p.title,
        p.etymology,
        JSON.stringify(p.stages),
        p.composition,
        p.mnemonic,
        JSON.stringify(p.examples),
      ]
    );
    postCount++;
  }
  console.log(`   ✓ ${postCount} posts\n`);

  // 4. Relações
  console.log("🔗 Inserindo relações de componentes...");
  let relCount = 0;
  for (const r of RELATIONS) {
    const parent = charMap.get(r.parent);
    const child  = charMap.get(r.child);
    if (!parent || !child) { console.warn(`   ⚠ Relação ignorada: ${r.parent} → ${r.child}`); continue; }
    try {
      await db.execute(
        `INSERT IGNORE INTO character_components (parent_id, child_id, role, position)
         VALUES (?, ?, ?, ?)`,
        [parent.id, child.id, r.role, r.position]
      );
      relCount++;
    } catch { /* ignora duplicatas */ }
  }
  console.log(`   ✓ ${relCount} relações\n`);

  await db.end();

  console.log("━".repeat(48));
  console.log("✅ Seed concluído!\n");
  console.log(`   • ${MODULES.length} módulos`);
  console.log(`   • ${CHARACTERS.length} caracteres`);
  console.log(`   • ${postCount} posts publicados`);
  console.log(`   • ${relCount} relações de componentes`);
  console.log("\n💡 Agora abra http://localhost:3000 e veja o resultado.");
}

seed().catch((err) => { console.error(err); process.exit(1); });
