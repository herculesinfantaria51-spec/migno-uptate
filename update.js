// CONFIGURAÇÃO ESTÁTICA - NÃO MUDA MAIS
const DB_NAME = "MignoDicengPort09_03_26v-1"; 
const URL_VERSAO = "https://raw.githubusercontent.com/herculesinfantaria51-spec/migno-uptate/main/migno-versao.json";
function mostrar(msg) {
    const display = document.getElementById("resultado");
    if (display) display.textContent = msg;
}

function verificarAtualizacao() {

    // Proteção: evita erro se o banco ainda não abriu
    if (!db) {
        mostrar("Database still loading... ⏳");
        return;
    }

    const VERSAO_LOCAL = parseInt(localStorage.getItem("versaoBanco")) || 0;
    const btn = document.getElementById("btnAtualizar");

    if (btn) btn.disabled = true;

    mostrar("Verificando novidades na loja... 🔎");

    fetch(URL_VERSAO + "?t=" + Date.now())
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(info => {

            if (info.versao > VERSAO_LOCAL) {

                mostrar("Nova atualização disponível! Baixando... ⬇️");
                baixarNovosDados(info.urlBanco, info.versao);

            } else {

                mostrar("Dicionário já está na versão mais recente! ✅");

                if (btn) btn.disabled = false;

            }

        })
        .catch(() => {

            mostrar("Erro de conexão. Verifique a internet! ❌");

            if (btn) btn.disabled = false;

        });
}


function baixarNovosDados(url, novaVersao) {
    fetch(url)
        .then(r => r.json())
        .then(dados => {

            // Soma os novos dados ao banco
            importarDados(dados); 

            // Atualiza a versão salva no app
            localStorage.setItem("versaoBanco", novaVersao);
            
            mostrar("Novas palavras somadas ao seu dicionário! 🚀");
            
            const btn = document.getElementById("btnAtualizar");

            if (btn) {
                btn.disabled = false;
                btn.style.background = "rgb(131, 170, 208)";
                btn.textContent = "Update Wörterbuch 🔄";
            }

        })
        .catch(() => {
            mostrar("Erro ao processar a soma dos dados. ❌");
        });
}

function verificarAtualizacaoSilenciosa() {

    const VERSAO_LOCAL = parseInt(localStorage.getItem("versaoBanco")) || 0;

    fetch(URL_VERSAO + "?t=" + Date.now())
        .then(r => r.json())
        .then(info => {

            if (info.versao > VERSAO_LOCAL) {

                const btn = document.getElementById("btnAtualizar");

                if (btn) {
                    btn.disabled = false;
                    btn.style.background = "#f59e0b";
                    btn.textContent = "New Wörterbuch Update! ⬇";
                }

                mostrar("New words available! Click Update Wörterbuch 🔄");

            }

        })
        .catch(() => {});

}
