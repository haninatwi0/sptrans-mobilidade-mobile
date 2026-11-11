# Mobilidade Urbana — Ônibus em São Paulo

Aplicativo desenvolvido em React Native para facilitar a consulta de linhas de ônibus na cidade de São Paulo, utilizando a API Olho Vivo da SPTrans.

**Disciplina:** Cross-Platform Application Development
**Projeto:** Global Solution — FIAP

## Sobre o projeto

O projeto tem como objetivo facilitar a mobilidade urbana da população da cidade de São Paulo, oferecendo uma ferramenta para consultar informações sobre o transporte público por ônibus.

O aplicativo consome dados da API Olho Vivo da SPTrans, permitindo que o cidadão pesquise linhas, consulte informações sobre seus trajetos, pontos de parada e veículos disponíveis.

Também utiliza AsyncStorage para armazenar localmente as linhas favoritas, permitindo que o usuário acesse suas linhas preferidas novamente.

## Funcionalidades

- **Consulta de linhas:** pesquisa de linhas de ônibus pelo número ou código.
- **Detalhes das linhas:** visualização de informações sobre o trajeto e os pontos de parada.
- **Informações dos veículos:** consulta dos dados disponíveis sobre os veículos e suas localizações.
- **Linhas favoritas:** possibilidade de adicionar e remover linhas favoritas.
- **Persistência local:** armazenamento das linhas favoritas utilizando AsyncStorage.
- **Gerenciamento de favoritos:** opção para remover todas as linhas favoritas.
- **Navegação entre telas:** interface organizada para facilitar a utilização do aplicativo.

## Tecnologias utilizadas

| Tecnologia            | Utilização                              |
| --------------------- | --------------------------------------- |
| React Native          | Desenvolvimento do aplicativo           |
| TypeScript            | Tipagem e organização do código         |
| Expo                  | Ambiente de desenvolvimento             |
| AsyncStorage          | Persistência local dos dados            |
| React Navigation      | Navegação entre telas                   |
| Node.js               | Ambiente de execução do backend         |
| Express               | Desenvolvimento do servidor             |
| SPTrans Olho Vivo API | Consulta de dados do transporte público |

## Estrutura do projeto

```text
sptrans-mobilidade-mobile/
│
├── assets/
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
├── server/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── components/
│   │   └── Button.tsx
│   │
│   ├── constants/
│   │   └── index.ts
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── BusLinesScreen.tsx
│   │   ├── BusDetailsScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── storage/
│   │   └── storage.ts
│   │
│   ├── theme/
│   │   └── index.ts
│   │
│   └── types/
│       └── index.ts
│
├── .gitignore
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## API Olho Vivo da SPTrans

O aplicativo utiliza a API Olho Vivo da SPTrans para acessar informações sobre as linhas e os veículos do transporte público de São Paulo.

**Documentação oficial:**
[https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/](https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/)

Para utilizar a API, é necessário realizar o cadastro no portal de desenvolvedores da SPTrans e obter um token de acesso.

O backend realiza a autenticação e as requisições à API, disponibilizando os dados para o aplicativo.

### Configuração do token

Na pasta principal do projeto, crie um arquivo chamado `.env`:

```env
SPTRANS_TOKEN=SEU_TOKEN_DA_SPTRANS
```

Substitua `SEU_TOKEN_DA_SPTRANS` pelo token obtido no portal da SPTrans.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub. Ele está incluído no `.gitignore`.

## Como executar o projeto

### Pré-requisitos

- Node.js
- npm
- Git
- Token de acesso da API Olho Vivo da SPTrans

### 1. Clonar o repositório

```bash
git clone https://github.com/haninatwi0/sptrans-mobilidade-mobile.git
```

Acesse a pasta:

```bash
cd sptrans-mobilidade-mobile
```

### 2. Instalar as dependências do aplicativo

Na pasta principal do projeto, execute:

```bash
npm install
```

### 3. Instalar as dependências do backend

```bash
cd server
npm install
```

Volte para a pasta principal:

```bash
cd ..
```

### 4. Configurar a API

Crie o arquivo `.env` na raiz do projeto e adicione o token da SPTrans, conforme explicado na seção anterior.

### 5. Iniciar o backend

Abra um terminal e execute:

```bash
cd server
npm start
```

O backend ficará disponível localmente na porta 3000.

### 6. Iniciar o aplicativo

Abra outro terminal na pasta principal do projeto e execute:

```bash
npx expo start --web
```

O aplicativo será iniciado no navegador.

Para executar em um dispositivo ou emulador, utilize o ambiente Expo correspondente.

**Observação:** para testar em um dispositivo físico, o endereço utilizado pelo aplicativo para acessar o backend deve apontar para o IP local do computador, em vez de `localhost`.

## Demonstração do aplicativo

https://youtu.be/lx33FwVTkLY

## Integrantes

| Nome completo                    | RM     |
| -------------------------------- | ------ |
| Hanin Atwi                       | 567626 |
| Laura Stephanie Vasquez Oliveira | 567277 |

## Repositório

[https://github.com/haninatwi0/sptrans-mobilidade-mobile](https://github.com/haninatwi0/sptrans-mobilidade-mobile)

---

**Global Solution — FIAP**
Cross-Platform Application Development
