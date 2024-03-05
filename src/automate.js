



/**
 * Esta função retorna todas as rotas  da API.
 * @returns 
 */

function allRoutes() {
  return {
    rotas: {
      post: {
        criar_usuario_pessoa_fisica:
          "http://localhost:3001/rh/perfil/usuario/fitcultural",
        criar_empresa: "http://localhost:3001/rh/perfil/empresa/fitcultural",
      },
      get: {
        recuperar_usuarios_pessoa_fisica:
          "http://localhost:3001/rh/perfil/usuarios/",
        recuperar_usuarios_empresa: "http://localhost:3001/rh/perfil/empresa/",
        recuperar_usuario_pessoa_fisica_por_id:
          "http://localhost:3001/rh/perfil/usuarios/:id",
        recuperar_usuario_empresa_por_id:
          "http://localhost:3001/rh/perfil/empresa/:id",
      },
      put: {
        alterar_nome_usuario:
          "http://localhost:3001/rh/perfil/usuario/edit-user/:id",
        alterar_nome_empresa:
          "http://localhost:3001/rh/perfil/usuario/edit-empresa/:id",
        alterar_fit_cultural_usuario:
          "http://localhost:3001/rh/perfil/usuario/edit-fitcult-usuario/:id",
        alterar_fit_cultural_empresa:
          "http://localhost:3001/rh/perfil/usuario/edit-fitcult-empresa/:id",
      },

      delete: {
        deletar_usuario_ou_empresa:
          "http://localhost:3001/rh/perfil/delete-user/:id",
      },
    },
  };
}



/**
 * EEssa função calcula a soma ponderada de uma lista de valores, onde cada valor é multiplicado por
 *  10% de um peso específico e então somado ao total. O resultado é arredondado para duas casas decimais e retornado como um número.
 * @param {*} lista - lista de valores recebidos pelo usuario com notas de 0 a 10
 * @param {*} peso - valor determinada para cada grupo de perguntas
 * @returns soma - valor retornado para implementar o calculo do fit cultural
 */

function calcularNota(lista, peso) {
  let soma = lista.reduce(
    (acumulador, valorAtual) => acumulador + ((valorAtual * 10) / 100) * peso,
    0
  );
  soma = soma.toFixed(2);
  soma = Number(soma);
  return soma;
}




/**
 * Essa função verifica qual o ultimo id salvo no banco tanto para empresas quanto para usuarios
 * calcula o novo id somando 1 (um)ao id encontrado no banco e retorna o novo valor para que possa
 * ser atribuido ao novo usuario, ao fazer isso o novo valor e atualizado no banco de dados
 * @param {*} storageID - local onde o id esta sendo armazenado no banco
 * @param {*} adminBd - instancia do firebase admin
 * @returns id - valor retornado pela função
 */

async function definitionID(storageID, adminBd) {
  var id = 0;
  console.log("entrando no definitionID");
  try {
    const snapshot = await adminBd.firestore().collection(storageID).get();
    if (snapshot.empty) {
      id = 1;
      await adminBd
        .firestore()
        .collection(storageID)
        .doc("verification-id")
        .set({ id: id });
      return id;
    } else {
      const doc = snapshot.docs[0];
      const data = doc.data();
      id = data.id;
      id += 1;
      await adminBd
        .firestore()
        .collection(storageID)
        .doc(doc.id)
        .update({ id: id });
      return id;
    }
  } catch (error) {
    console.error({
      err: `erro ao tentar gerar um id - type of error:  ${err.message}`,
    });
  }
}




/**
 * Basicamente essa função verifica se existe algum usuario do tipo 'disponible' caso encontre esse usuario
 * a função retora seu id, caso contrario a função retorna false
 * @param {*} admin
 * @returns {*} userIdx - que pode ser um numero ou false
 */

async function verificarLinesUser(admin) {
  try {
    const snapshot = await admin.firestore().collection("Perfil Usuario").get();
    let userIdx = false;
    for (let index = 0; index < snapshot.docs.length; index++) {
      const doc = snapshot.docs[index];
      const userData = doc.data().perfil_do_usuario.dados_do_usuario;
      if (userData.user === "disponible") {
        userIdx = userData.id;
      }
    }
    return userIdx;
  } catch (error) {
    console.error({
      err: `erro ao tentar encontrar um id vazio - type of error:  ${err.message}`,
    });
    throw error;
  }
}





/**
 * Essa função adcionar um usuario ou empresa no banco de dados, uma informação importante é  que como
 *  condição para salvar o usuario no banco de dados, a função necessariamente precisa salvar tambem o teste
 * fit cultural do usuario
 * @param {*} admin
 * @param {*} rotulo
 * @param {*} dado
 */

async function addUsuario(admin, rotulo, dado) {
  try {
    const usuarioRef = await admin.firestore().collection(rotulo).add({
      perfil_do_usuario: dado,
    });
  } catch (error) {
    console.error({
      err: `erro ao tentar salvar ${dado.user} - type of error:  ${err.message}`,
    });
  }
}

/**
 * Essa função atualiza os dados do usuario/ empresa cadastrado no banco de dados
 * @param {*} admin
 * @param {*} rotulo
 * @param {*} dados
 */

async function updateUsuario(admin, rotulo, dados) {
  try {
    const snapshot = await admin.firestore().collection(rotulo).get();

    snapshot.forEach(async (doc) => {
      const perfil = doc.data().perfil_do_usuario.dados_do_usuario;

      if (perfil.user === "disponible") {
        try {
          await doc.ref.update({
            perfil_do_usuario: {
              ...dados, // Novos dados que deseja atualizar
            },
          });
          console.error({
            err: `erro ao tentar atualizar ${rotulo} - type of error:  ${err.message}`,
          });
        } catch (err) {
          console.error({
            err: `erro ao tentar deletar ${rotulo} - type of error:  ${err.message}`,
          });
        }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    throw error;
  }
}




/**
 * Essa função deleta a empresa ou usuario do banco de dados, sobrescrevendo seus valores  de forma
 * que o id possa ser utilizado por um novo usuario posteriormente
 * @param {*} admin
 * @param {*} rotulo
 * @param {*} id
 */

async function deletarUsuario(admin, rotulo, id) {
  try {
    const snapshot = await admin.firestore().collection(rotulo).get();

    snapshot.forEach(async (doc) => {
      const perfil = doc.data().perfil_do_usuario;
      if (perfil.dados_do_usuario.id == id) {
        try {
          await doc.ref.update({
            perfil_do_usuario: {
              dados_do_usuario: {
                id: perfil.dados_do_usuario.id,
                user: "disponible",
              },
              fitcultural: {
                dados: "nenhum",
              },
            },
          });
        } catch (err) {
          console.error({
            err: `erro ao tentar deletar ${rotulo} - type of error:  ${err.message}`,
          });
        }
      }
    });
  } catch (error) {
    console.error({
      err: `erro ao tentar deletar ${rotulo} - type of error:  ${err.message}`,
    });
    throw error;
  }
}



//modulos da função
module.exports = {
  calcularNota,
  definitionID,
  verificarLinesUser,
  addUsuario,
  updateUsuario,
  deletarUsuario,
  allRoutes,
};
