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



  async function definitionID(storageID, adminBd) {
    var id = 0;
    try {
      const snapshot = await adminBd.firestore().collection(storageID).get();
      if (snapshot.empty) {
        id= 1
        // Se não houver documentos na coleção, cria um novo documento com o ID especificado
        const newDocRef = await adminBd.firestore().collection(storageID).doc().set({ id: id });
     
       
      }else{
       
        const doc = snapshot.docs[0];
        const data = doc.data();
        var indice = data.id;
      id =   indice +1
        const newDocRef = await adminBd.firestore().collection(storageID).doc().set({ id: indice});
        return id

       
      }
    } catch (error) {
     
      throw error;
    }
  }
  
  
  

async function verificarLinesUser(admin) {
    try {
      const snapshot = await admin
        .firestore()
        .collection("Perfil Usuario")
        .get();
  
      let userIdx = false; // Inicializamos como -1 para indicar que não encontramos nenhum usuário
  
      for (let index = 1; index < snapshot.docs.length; index++) {
        const doc = snapshot.docs[index];
        const userData = doc.data().perfil_do_usuario.dados_do_usuario;
        if (userData.user === "disponible") {
          userIdx = index;
  
          break; // Interrompe o loop assim que encontrar o usuário disponível
        }else{
  
          userIdx= false // Retorna o índice do usuário ou -1 se nenhum for encontrado
        }
      }
  return  userIdx;
    } catch (error) {
      console.error("Erro ao tentar buscar usuário:", error);
      throw error; // Lança o erro para ser tratado no código que chama a função
    }
  }
  



  /*função para registrar novos usuarios pessoas fisica no banco*/ 
  async function addUsuario(admin,rotulo,dado){
    try{

      const usuarioRef = await admin
      .firestore()
      .collection(rotulo)
      .add({
        perfil_do_usuario: dado,
      });
    }catch(error){
      console.log(`Ocorreu o erro ${error} ao tentar salvar o usuario`)
    }
  }

  
  /*função para registrar novos usuarios pessoas fisica no banco*/ 
  async function addEmpresa(admin,rotulo){
    try{

      const usuarioRef = await admin
      .firestore()
      .collection(rotulo)
      .add({
        perfil_da_empresa: resposta,
      });
    }catch(error){
      console.log('ocorreu um erro ao tentar salvar o usuario')
    }
  }


  /**Função para atualizar usuarios no banco */
async function atualizarUsuario(){
  
}


  module.exports= 
  {
    calcularNota,
    definitionID,
    verificarLinesUser,
    addUsuario,
    addEmpresa,
  }