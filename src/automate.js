//função para retornar todas as rotas validas
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
          "http://localhost:3001/rh/perfil/usuario/edit-usuario/:id",
        alterar_nome_empresa:
          "http://localhost:3001/rh/perfil/usuario/edit-empresa/:id",
        alterar_fit_cultural_usuario:
          "http://localhost:3001/rh/perfil/usuario/edit-fitcult-usuario/:id",
        alterar_fit_cultural_empresa:
          "http://localhost:3001/rh/perfil/usuario/edit-fitcult-empresa/:id",
      },

      delete:{
        deletar_usuario_ou_empresa:'http://localhost:3001/rh/perfil/delete-user/:id'
      }
    },
  };
}

/* Essa função calcula as notas de todas as 8 culturas, tanto para empresas quanto para usuarios pessoa fisica */
function calcularNota(lista, peso) {
  let soma = lista.reduce(
    (acumulador, valorAtual) => acumulador + ((valorAtual * 10) / 100) * peso,
    0
  );
  soma = soma.toFixed(2);
  soma = Number(soma);
  return soma;
}

/* Essa função determina o id que sera atribuido a cada novo usuario no banco de dados, de forma dinamica e automatizada */
async function definitionID(storageID, adminBd) {
  var id = 0;
  console.log("entrando no definitionID");
  try {
    const snapshot = await adminBd.firestore().collection(storageID).get();
    if (snapshot.empty) {
      id = 1;
      console.log("case empty");
      // Se não houver documentos na coleção, cria um novo documento com o ID especificado
      await adminBd
        .firestore()
        .collection(storageID)
        .doc("verification-id")
        .set({ id: id });
      return id;
    } else {
      console.log("case existente");
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
    console.log(error);
  }
}

/* Essa função verifica se existem id vazios no banco de dados e preenche com novos usuarios,
uma melhoria necessaria é que precisa encotnrar e atribuir ao primeiro encontrado, uma ideia para resolver será 
colocar os id encotrados  em um array e na hora de adcionar o usuario escolher sempre o indice 0 do array*/
async function verificarLinesUser(admin) {
  try {
    const snapshot = await admin.firestore().collection("Perfil Usuario").get();

    let userIdx = false;

    for (let index = 0; index < snapshot.docs.length; index++) {
      const doc = snapshot.docs[index];
      const userData = doc.data().perfil_do_usuario.dados_do_usuario;
      console.log(userData.user);
      if (userData.user === "disponible") {
        userIdx = userData.id;
        // break;
      }
    }
    return userIdx;
  } catch (error) {
    console.error("Erro ao tentar buscar usuário:", error);
    throw error;
  }
}

/*função para registrar novos usuarios pessoas fisica no banco*/
async function addUsuario(admin, rotulo, dado) {
  try {
    const usuarioRef = await admin.firestore().collection(rotulo).add({
      perfil_do_usuario: dado,
    });
  } catch (error) {
    console.log(`Ocorreu o erro ${error} ao tentar salvar o usuario`);
  }
}

/*   /*função para registrar novos usuarios pessoas fisica no banco*/
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
          console.log("Dados do usuário atualizados");
        } catch (err) {
          console.error("Erro na atualização de dados", err);
        }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    throw error;
  }
}

/* vamos agora criar uma função que deleta usuarios no banco de dados, lembrando que na verdade ao invez de deletar, vamos atribuir o valor 'disponible' para usuario, manter o valor
do id e deixar o fit cultural vazio */
async function deletarUsuario(admin, rotulo, id) {
  try {
    const snapshot = await admin.firestore().collection(rotulo).get();

    snapshot.forEach(async (doc) => {
      const perfil = doc.data().perfil_do_usuario;
      console.log(`id ${id}//${perfil.dados_do_usuario.id} `);

      if (perfil.dados_do_usuario.id == id) {
        console.log(`id ${id}//${perfil.dados_do_usuario.id} `);
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
          console.log("Dados do usuário atualizados");
        } catch (err) {
          console.error("Erro na atualização de dados", err);
        }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    throw error;
  }
}

module.exports = {
  calcularNota,
  definitionID,
  verificarLinesUser,
  addUsuario,
  updateUsuario,
  deletarUsuario,
  allRoutes
};
