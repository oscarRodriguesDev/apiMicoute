const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
var serviceAccount = require("./services/credential.json");
var admin = require("firebase-admin");

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/*
 *a verificação de que a api esta em pleno funcionamento
 */

app.get("/verification", (req, res) => {
  res.json({ message: "Api no ar" });
});

/*
 *a verificação de que a api esta em pleno funcionamento
 */

app.get("/", (req, res) => {
  res.json({ message: "Api no ar" });
});

/*
 *Abaixo temos todas os meios de salvar o fit cultural do usuario e empresa que é apenas um dos testes
 * comportamentais que devem ser feit
 */


/* retorna todos os fit cultural dos usuários */
app.get("/fitcultalusers", async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("Fit Cultural Usuarios")
      .get();
    let fitUsers = [];
    snapshot.forEach((doc) => {
      fitUsers.push(doc.data());
    });
    return res.status(200).send(fitUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ erro: "Values not Found", error: err });
  }
});

/* Retorna o fit culturual de todas as empresas */
app.get("/fitcultalcompanies", async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("Fit Cultural Empresas")
      .get();
    let fitEmpresas = [];
    snapshot.forEach((doc) => {
      fitEmpresas.push(doc.data());
    });
    return res.status(200).send(fitEmpresas);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ erro: "Values not Found", error: err });
  }
});

/* Retorna o fit cultural do usuario informado no id */
app.get("/result/user/:id", async (req, res) => {
  var { id } = req.params;
  id = id.slice(1);
  try {
    const snapshot = await admin
      .firestore()
      .collection("Fit Cultural Usuarios")
      .get();
    let usuario = null; // Inicializamos como null, para verificar se encontramos um usuário
    snapshot.forEach((doc) => {
      if (doc.data().fitCultural.dados.id == id) {
        usuario = doc.data();
      }
    });

    if (usuario !== null) {
      // Se encontramos um usuário, enviamos a resposta com os dados do usuário
      return res.send(usuario);
    } else {
      // Se não encontramos um usuário, enviamos a resposta indicando que não foi encontrado
      return res.status(404).send("Usuário não encontrado!");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ erro: "Erro ao buscar os valores", error: err });
  }
});

/* Retorna o fit cultural da empresa pelo id */
app.get("/result/companies/:id", async (req, res) => {
  var { id } = req.params;
  id = id.slice(1);
  try {
    const snapshot = await admin
      .firestore()
      .collection("Fit Cultural Empresas")
      .get();
    let empresa = null; // Inicializamos como null, para verificar se encontramos um usuário
    snapshot.forEach((doc) => {
      if (doc.data().fitCultural.dados.id == id) {
        empresa = doc.data();
      }
    });

    if (empresa !== null) {
      // Se encontramos um usuário, enviamos a resposta com os dados do usuário
      return res.send(empresa);
    } else {
      // Se não encontramos um usuário, enviamos a resposta indicando que não foi encontrado
      return res.status(404).send("Usuário não encontrado!");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ erro: "Erro ao buscar os valores", error: err });
  }
});

//salva o fit cultural do usuario informado no corpo da requisição
app.post("/user/fitcultural", async (req, res) => {
  /*   const {user,inovação,autonomia,competicao,meritocracia,estabilidade,ordem,acolhimento,proposito} = req.body; */
  //a requisição deve enviar os arrays, o id e o usuario que seão tratados abaixo
  try {
    var id = await definitionID("id-usuario");
    var user = "Cassio";
    var inovacao = calcularNota([5, 4, 6, 1, 3, 5], 2.08);
    var autonomia = calcularNota([7, 5, 4, 9, 1], 2.5);
    var competicao = calcularNota([5, 4, 4, 9], 3.12);
    var meritocracia = calcularNota([1, 4, 2, 9], 3.12);
    var estabilidade = calcularNota([1, 3, 8, 10], 3.12);
    var ordem = calcularNota([4, 5, 3, 7], 3.12);
    var acolhimento = calcularNota([1, 3, 5, 7, 9, 2], 2.08);
    var proposito = calcularNota([7, 9, 5, 1], 3.12);

    //calculo percentual
    var total =
      inovacao +
      autonomia +
      competicao +
      meritocracia +
      estabilidade +
      ordem +
      acolhimento +
      proposito;
    Number((inovacao = ((inovacao / total) * 100).toFixed(2)));
    Number((autonomia = ((autonomia / total) * 100).toFixed(2)));
    Number((competicao = ((competicao / total) * 100).toFixed(2)));
    Number((meritocracia = ((meritocracia / total) * 100).toFixed(2)));
    Number((estabilidade = ((estabilidade / total) * 100).toFixed(2)));
    Number((ordem = ((ordem / total) * 100).toFixed(2)));
    Number((acolhimento = ((acolhimento / total) * 100).toFixed(2)));
    Number((proposito = ((proposito / total) * 100).toFixed(2)));

    const data = {
      id,
      user,
      inovacao,
      autonomia,
      competicao,
      meritocracia,
      estabilidade,
      ordem,
      acolhimento,
      proposito,
    };
    //respostas do fit cultural
    const fitCultural = {
      dados: {
        id: data.id,
        user: data.user,
      },
      resposta: {
        inovacao: data.inovacao,
        autonomia: data.autonomia,
        competição: data.competicao,
        meritocracia: data.meritocracia,
        estabilidade: data.estabilidade,
        ordem: data.ordem,
        acolhimento: data.acolhimento,
        proposito: data.proposito,
      },
    };

    const usuarioRef = await admin
      .firestore()
      .collection("Fit Cultural Usuarios")
      .add({
        fitCultural,
      });
    res.json({
      message: `Fit cultural de ${fitCultural.dados.user} salvo com sucesso na base de dados`,
    });
  } catch (error) {
    res.json({
      message: error | `err 400 NOT FOUND`,
    });
  }
});



app.post("/companies/fitcultural", async (req, res) => {
  try {
    var id = await definitionID("id-empresas");
    var empresa = "Dikma";
    var inovacao = calcularNota([2, 4, 4, 2, 1, 6], 2.08);
    var autonomia = calcularNota([2, 5, 5, 7, 6], 2.5);
    var competicao = calcularNota([5, 1, 3, 9], 3.12);
    var meritocracia = calcularNota([5, 2, 1, 2], 3.12);
    var estabilidade = calcularNota([5, 8, 3, 6], 3.12);
    var ordem = calcularNota([5, 2, 1, 8], 3.12);
    var acolhimento = calcularNota([5, 5, 7, 9, 1, 2], 2.08);
    var proposito = calcularNota([6, 4, 2, 3], 3.12);

    //calculo percentual
    var total =
      inovacao +
      autonomia +
      competicao +
      meritocracia +
      estabilidade +
      ordem +
      acolhimento +
      proposito;
    Number((inovacao = ((inovacao / total) * 100).toFixed(2)));
    Number((autonomia = ((autonomia / total) * 100).toFixed(2)));
    Number((competicao = ((competicao / total) * 100).toFixed(2)));
    Number((meritocracia = ((meritocracia / total) * 100).toFixed(2)));
    Number((estabilidade = ((estabilidade / total) * 100).toFixed(2)));
    Number((ordem = ((ordem / total) * 100).toFixed(2)));
    Number((acolhimento = ((acolhimento / total) * 100).toFixed(2)));
    Number((proposito = ((proposito / total) * 100).toFixed(2)));

    const data = {
      id,
      empresa,
      inovacao,
      autonomia,
      competicao,
      meritocracia,
      estabilidade,
      ordem,
      acolhimento,
      proposito,
    };

    //respostas do fit cultural
    const fitCultural = {
      dados: {
        id: data.id,
        empresa: data.empresa,
      },
      resposta: {
        inovacao: data.inovacao,
        autonomia: data.autonomia,
        competição: data.competicao,
        meritocracia: data.meritocracia,
        estabilidade: data.estabilidade,
        ordem: data.ordem,
        acolhimento: data.acolhimento,
        proposito: data.proposito,
      },
    };

    //salvando no banco de dados
    const usuarioRef = await admin
      .firestore()
      .collection("Fit Cultural Empresas")
      .add({
        fitCultural,
      });

    res.json({
      message: `Fit Cultural da Empresa ${fitCultural.dados.empresa} salvo com sucesso na base de dados`,
    });
  } catch (Error) {
    res.json({
      message: "erro 400 NOT FOUND",
    });
  }
});



//alterar o nome de usuaio

  app.put("/user/edit-user/:id", async (req, res) => {
    try {
      var { id } = req.params;
        id=id.slice(1)
      var { novoNome } = '';
        novoNome ='Cassio Jordan'
      // Verificar se o ID fornecido é válido
      if (!id) {
        return res.status(400).json({ message: "ID do usuário não fornecido" });
      }
  
      // Verificar se o novo nome foi fornecido
      if (!novoNome) {
        return res.status(400).json({ message: "Novo nome do usuário não fornecido" });
      }
  
      // Atualizar o nome do usuário no banco de dados
      await admin.firestore().collection("Fit Cultural Usuarios").doc(id).update({
        "fitCultural.dados.user": novoNome
      });
  
      res.json({ message: `Nome do usuário atualizado com sucesso para ${novoNome}` });
    } catch (error) {
      res.status(500).json({ message: `Erro ao atualizar o nome do usuário: ${error.message}` });
    }
  });
  
     

//deletar resultado do fit cultural do usuario
app.delete("/del/resultado/user/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `vai deletar o usuario no banco` });
});

//deletar resultado do fit cultural da empresa
app.delete("/del/resultado/companies/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `vai deletar a empresa no banco` });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

//função para calcular a nota de cada uma das culturas
function calcularNota(lista, peso) {
  let soma = lista.reduce(
    (acumulador, valorAtual) => acumulador + ((valorAtual * 10) / 100) * peso,
    0
  );
  soma = soma.toFixed(2);
  soma = Number(soma);
  return soma;
}

/*define o id para o usuario*/
async function definitionID(storageID) {
  try {
    const antIDQuery = await admin
      .firestore()
      .collection(storageID)
      .orderBy("id", "desc")
      .limit(1)
      .get();

    let id;
    if (antIDQuery.empty) {
      // Se não houver documentos na coleção, começamos com ID 1
      id = 1;
      await admin.firestore().collection(storageID).doc().set({ id: id });
    } else {
      // Se houver um documento, obtemos o último ID, incrementamos e substituímos o documento existente
      const antIDDoc = antIDQuery.docs[0];
      id = antIDDoc.data().id + 1;
      await antIDDoc.ref.set({ id: id });
    }
    return id;
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}
