# Projeto Integrador V-B

Para rodar esse projeto, siga os seguintes passos:

1. Instale a versão LTS do [Node](https://nodejs.org/en).
2. Com o Node instalado, será necessário instalar o pacote [JSON Server](https://github.com/typicode/json-server), responsável por rodar o back-end da aplicação, e o pacote [http-server](https://www.npmjs.com/package/http-server), responsável por rodar o front-end da aplicação. Para isso, rode os seguintes comandos no seu terminal:

```bash
npm install -g json-server
```

```bash
npm install --global http-server
```

3. Com o pacote instalado, acesse, pelo terminal, a pasta onde seu projeto está armazenado.
4. Feito isso, rode o seguinte comando para ativar nosso back-end.

```bash
json-server --watch db/db.json
```

5. Agora que o back-end está rodando, acesse novamente, em uma nova aba no seu terminal, a pasta onde seu projeto está armazenado.
6. Feito isso, rode o seguinte comando para ativar nosso front-end.

```bash
http-server .
```

7. Com tudo rodando, acesse o link do seu projeto pelo navegador http://127.0.0.1:8080.
8. Pronto, seu projeto está rodando.
