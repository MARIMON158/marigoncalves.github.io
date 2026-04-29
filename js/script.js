document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção de elementos
    const botao = document.getElementById('btn-iniciar');
    const destino = document.getElementById('meu-portfolio');
    const loading = document.getElementById('tela-loading');
    const musica = document.getElementById('musica-fundo'); // Referência ao seu <audio>
    const btnMutar = document.getElementById('btn-mutar'); // Referência ao ícone de som na barra
    const volumeSlider = document.getElementById('volume-slider');
    const iconeVolume = document.getElementById('icone-volume');
    
    // 2. Função que inicia o "Sistema"
    const acaoDeIniciar = () => {
        
        if (destino && loading) {

            document.body.classList.add("sistema-ativo");
            // TOCA A MÚSICA
            if (musica) {
                musica.volume = 0.4; // Volume em 40% para ser agradável
                musica.play().catch(e => console.log("O navegador bloqueou o autoplay. O usuário precisa interagir primeiro."));
            }

            // MOSTRA O LOADING
            loading.style.display = 'flex';

            // ESPERA O CARREGAMENTO (2 segundos)
            setTimeout(() => {
                loading.style.display = 'none';

                // Libera o scroll
                document.body.classList.remove('travado');
                document.body.style.overflow = "auto";
                document.body.style.height = "auto";

                // Desce suavemente
                destino.scrollIntoView({ behavior: 'smooth' });
            }, 2000); 
        }
    };
// 3. LOGICA DO VOLUME (Onde você deve colocar o código novo)
    if (volumeSlider && musica) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            musica.volume = volume;

            if (volume == 0) {
                iconeVolume.textContent = '🔈';
            } else if (volume < 0.5) {
                iconeVolume.textContent = '🔉';
            } else {
                iconeVolume.textContent = '🔊';
            }
        });
    }
    // 4. Atalhos de Teclado (Enter para entrar, Esc para sair)
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            acaoDeIniciar();
        }
        if (event.key === 'Escape') {
            voltarAoInicio();
        }
    });

    // 4. Clique no botão Iniciar
    if (botao) {
        botao.addEventListener('click', acaoDeIniciar);
    }

    // 5. Lógica do botão Mudo (🔊/🔈)
    if (btnMutar && musica) {
        btnMutar.addEventListener('click', () => {
            if (musica.paused) {
                musica.play();
                btnMutar.textContent = '🔊';
            } else {
                musica.pause();
                btnMutar.textContent = '🔈';
            }
        });
    }
});

// --- FUNÇÕES GLOBAIS (Fora do DOMContentLoaded para o HTML enxergar) ---

// 1. Relógio em tempo real
function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const el = document.getElementById('relogio-topo');
    if (el) {
        el.textContent = `${horas}:${minutos}`;
    }
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// 2. Voltar para a tela inicial (Usado pelo botão X e pela tecla ESC)
function voltarAoInicio() {
    document.body.classList.add('travado');
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

let janelaAtual = null;

// 🪟 ABRIR
function abrirJanela(id) {
    const nova = document.getElementById(id);
    if (!nova) return;

    // remove estado minimizado
    nova.classList.remove("minimizada");

    // fecha a atual COMPLETAMENTE
    if (janelaAtual && janelaAtual !== nova) {
        janelaAtual.classList.remove("ativa", "maximizada");
    }

    nova.classList.add("ativa");
    janelaAtual = nova;
}

// ❌ FECHAR
function fecharJanela(id) {
    const janela = document.getElementById(id);
    if (!janela) return;

    janela.classList.remove("ativa", "minimizada", "maximizada");

    if (janelaAtual === janela) {
        janelaAtual = null;
    }
}

function minimizarJanela(id) {
    const janela = document.getElementById(id);
    const barra = document.getElementById("barra-tarefas");

    if (!janela || !barra) return;

    // remove maximizado (evita bug)
    janela.classList.remove("maximizada");

    const botaoExistente = document.getElementById("btn-" + id);

// 👉 se já está minimizada → fecha tudo
if (janela.classList.contains("minimizada")) {
    if (botaoExistente) botaoExistente.remove();
    janela.classList.remove("minimizada", "ativa");
    return;
}

// 👉 evita duplicar botão
if (botaoExistente) return;

    const item = document.querySelector(`[data-janela="${id}"]`);

    let iconeSrc = "";
    if (item) {
        const img = item.querySelector("img");
        if (img) iconeSrc = img.src;
    }

    const botao = document.createElement("button");
    botao.classList.add("botao-janela");
    botao.id = "btn-" + id;

    botao.innerHTML = `
        <img src="${iconeSrc}">
        <span>${id.replace("janela-", "")}</span>
    `;

    botao.onclick = () => {
        janela.classList.remove("minimizada");
        janela.classList.add("ativa");
        janelaAtual = janela;
        botao.remove();
    };

    barra.appendChild(botao);

    // animação
    const barraRect = barra.getBoundingClientRect();
    const janelaRect = janela.getBoundingClientRect();

    const deltaX = (barraRect.left + barraRect.width / 2) - (janelaRect.left + janelaRect.width / 2);
    const deltaY = barraRect.top - janelaRect.top;

    janela.style.transition = "all 0.4s ease";
    janela.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
    janela.style.opacity = "0";

    setTimeout(() => {
        janela.classList.remove("ativa");
        janela.classList.add("minimizada");

        janela.style.transition = "";
        janela.style.transform = "";
        janela.style.opacity = "";
    }, 400);
}

function maximizarJanela(id) {
    const janela = document.getElementById(id);
    if (!janela) return;

    // 🔥 garante que ela está visível
    janela.classList.remove("minimizada");
    janela.classList.add("ativa");

    // 🔥 remove transform antigo (IMPORTANTE)
    janela.style.transform = "";
    janela.style.top = "";
    janela.style.left = "";
    janela.style.opacity = "";

    // 🔥 alterna maximizar
    if (janela.classList.contains("maximizada")) {
        janela.classList.remove("maximizada");
    } else {
        janela.classList.add("maximizada");
    }

    janelaAtual = janela;
}



// 👇 FINAL DO JS
document.querySelectorAll(".barra").forEach(barra => {
   // 🖱️ ARRASTAR + SNAP WINDOWS
document.querySelectorAll(".barra").forEach(barra => {
    const janela = barra.parentElement;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    barra.addEventListener("mousedown", (e) => {
        isDragging = true;

        offsetX = e.clientX - janela.offsetLeft;
        offsetY = e.clientY - janela.offsetTop;

        // remove estados
        janela.classList.remove("snap-esquerda", "snap-direita", "maximizada");
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        janela.style.left = (e.clientX - offsetX) + "px";
        janela.style.top = (e.clientY - offsetY) + "px";
        janela.style.transform = "none";
    });

    document.addEventListener("mouseup", (e) => {
        if (!isDragging) return;

        isDragging = false;

        const larguraTela = window.innerWidth;

        // 👈 esquerda
        if (e.clientX < 50) {
            janela.classList.add("snap-esquerda");
        }

        // 👉 direita
        else if (e.clientX > larguraTela - 50) {
            janela.classList.add("snap-direita");
        }

        // ⬆ topo (maximiza)
        else if (e.clientY < 50) {
            janela.classList.add("maximizada");
        }
    });
});

});