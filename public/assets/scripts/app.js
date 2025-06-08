    // URL base do JSONServer
    const API_URL = "http://localhost:3000/filmes";

    // =================================================================
    // Funções específicas para index.html
    // =================================================================

    //Funçao em js para gerar a categoria "Filmes em destaque"
document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("filmesContainer");
    const carouselInner = document.getElementById("carouselInner");

    try {
        const response = await fetch(API_URL);
        const filmes = await response.json();

        // Filmes em destaque
        if (container) {
            let html = "";
            for (let filme of filmes) {
                html += `
                    <article class="category-item position-relative">
                      <button class="favorite-btn position-absolute top-0 end-0 m-2 btn btn-link p-0" data-id="${filme.id}" aria-label="Favoritar">
                        <i class="bi bi-heart fs-4 text-white"></i>
                      </button>
                      <a href="detalhes.html?id=${filme.id}" class="item-link">
                        <div class="filme-item">
                          <img src="${filme.imagem}" alt="${filme.titulo}">
                          <div class="filme-info">
                            <h3>${filme.titulo}</h3>
                            <p>${filme.descricao}</p>
                          </div>
                        </div>
                      </a>
                    </article>
              `;
            }
            container.innerHTML = html;
            marcarFavoritosNaTela();
        }

        // Carrossel
        if (carouselInner) {
            let html = "";
            filmes.forEach((filme, index) => {
                html += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <a href="detalhes.html?id=${filme.id}">
                        <img src="${filme.imagem}" class="d-block w-100" alt="${filme.titulo}">
                        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-2">
                            <h5>${filme.titulo}</h5>
                            <p>${filme.descricao}</p>
                        </div>
                        </a>
                    </div>
                `;
            });
            carouselInner.innerHTML = html;
        }

    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }
});

    // =================================================================
    // Funções específicas para detalhes.html
    // =================================================================

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    //console.log(id);
    const tela = document.getElementById("tela");

    if (!id || !tela) return;

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Filme não encontrado");

        const filme = await response.json();

        let imagensAtoresHTML = filme.imagens_complementares.map(imagem => `
            <div class="ator mb-3 p-3 bg-dark rounded shadow-sm text-center" style="width: 260px;">
                <img src="${imagem.src}" alt="${imagem.descricao}" class="img-fluid rounded mb-2" style="width: 250px; height: 250px; object-fit: cover;">
                <p class="text-white mb-0">${imagem.descricao}</p>
            </div>
        `).join("");

        tela.innerHTML = `
            <h1>${filme.titulo}</h1>
            <img src="${filme.imagem}" alt="Capa do filme" class="img-fluid mb-3">
            <p>${filme.descricao}</p>
            <p><strong>Resumo:</strong> ${filme.conteudo}</p>
            <p><strong>Gênero:</strong> ${filme.categoria}</p>
            <p><strong>Autor:</strong> ${filme.autor}</p>
            <p><strong>Lançamento:</strong> ${filme.data}</p>
            <p><strong>Atores principais:</strong></p>
            <div class="d-flex flex-wrap gap-3">
                ${imagensAtoresHTML}
            </div>
        `;

    } catch (error) {
        tela.innerHTML = "<h1>Filme não encontrado</h1>";
        console.error(error);
    }
});

    // =================================================================
    // Funções específicas para cadastro_filmes.html
    // =================================================================

const formFilme = document.getElementById('form-filme');
if (formFilme) {
  formFilme.addEventListener('submit', async function (e) {
    e.preventDefault();

  const form = e.target;
  const isEditing = form.dataset.editing;
  const id = isEditing;

  // Captura dos dados do formulário
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const conteudo = document.getElementById('conteudo').value;
  const categoria = document.getElementById('categoria').value;
  const autor = document.getElementById('autor').value;
  const data = document.getElementById('data').value;
  const imagem = document.getElementById('imagem').value;

  // Captura das imagens dos atores
  const imagens_complementares = [];

  for (let i = 1; i <= 3; i++) {
    const src = document.getElementById(`imgAtor${i}`).value.trim();
    const desc = document.getElementById(`descAtor${i}`).value.trim();

    if (src && desc) {
      imagens_complementares.push({
        id: i,
        src,
        descricao: desc
      });
    }
  }

  // Objeto do filme
  const filme = {
    titulo,
    descricao,
    conteudo,
    categoria,
    autor,
    data,
    imagem,
    imagens_complementares
  };

  try {
    const response = await fetch(
      isEditing ? `${API_URL}/${id}` : API_URL,
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(filme)
      }
    );

    if (!response.ok) throw new Error("Erro ao salvar filme");

    alert(isEditing ? "Filme atualizado com sucesso!" : "Filme cadastrado com sucesso!");
    form.reset();
    delete form.dataset.editing; // limpa modo edição
    location.reload(); // recarrega a tabela

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao salvar filme.");
  }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById('tabela-filmes')) return; // só executa se a tabela existir (na página de cadastro)

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao carregar filmes");
    const filmes = await response.json();

    const tbody = document.querySelector("#tabela-filmes tbody");
    tbody.innerHTML = ""; // limpa tabela

    filmes.forEach(filme => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${filme.id}</td>
        <td>${filme.titulo}</td>
        <td>${filme.autor}</td>
        <td>${filme.categoria}</td>
        <td>${filme.data}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar" data-id="${filme.id}">Editar</button>
          <button class="btn btn-danger btn-sm btn-excluir" data-id="${filme.id}">Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Função para excluir filme
    function excluirFilme(id) {
      if (confirm("Tem certeza que deseja excluir este filme?")) {
        fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        })
          .then(response => {
            if (!response.ok) throw new Error("Erro ao excluir filme.");
            alert("Filme excluído com sucesso!");
            location.reload();
          })
          .catch(error => {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir filme.");
          });
      }
    }

    // Função para editar filme
    function editarFilme(id) {
      fetch(`${API_URL}/${id}`)
        .then(response => {
          if (!response.ok) throw new Error("Erro ao buscar filme.");
          return response.json();
        })
        .then(filme => {
          document.getElementById('titulo').value = filme.titulo;
          document.getElementById('descricao').value = filme.descricao;
          document.getElementById('conteudo').value = filme.conteudo;
          document.getElementById('categoria').value = filme.categoria;
          document.getElementById('autor').value = filme.autor;
          document.getElementById('data').value = filme.data;
          document.getElementById('imagem').value = filme.imagem;

          if (filme.imagens_complementares) {
            filme.imagens_complementares.forEach((img, i) => {
              document.getElementById(`imgAtor${i + 1}`).value = img.src;
              document.getElementById(`descAtor${i + 1}`).value = img.descricao;
            });
          }

          document.getElementById('form-filme').dataset.editing = id;
        })
        .catch(error => {
          console.error("Erro ao editar:", error);
          alert("Erro ao carregar dados do filme.");
        });
    }

    // Event listeners para botões
    document.querySelectorAll(".btn-editar").forEach(botao => {
      botao.addEventListener("click", () => {
        const id = botao.dataset.id;
        editarFilme(id);
      });
    });

    document.querySelectorAll(".btn-excluir").forEach(botao => {
      botao.addEventListener("click", () => {
        const id = botao.dataset.id;
        excluirFilme(id);
      });
    });

  } catch (error) {
    console.error(error);
  }
});

    // =================================================================
    // Funções específicas o grafico chart.js
    // =================================================================

    window.onload = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar dados");

    const filmes = await response.json();
    console.log(filmes);

    const listaFilmes = filmes;
    createPieChart(listaFilmes);
  } catch (error) {
    console.error("Erro:", error);
  }
}

function createPieChart(data) {
  const categorias = {};
  
  // Conta quantos filmes há por categoria
  data.forEach(filme => {
    const categoria = filme.categoria;
    if (categoria in categorias) {
      categorias[categoria]++;
    } else {
      categorias[categoria] = 1;
    }
  });

  const ctx = document.getElementById("categoriaChart").getContext("2d");

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        label: 'Quantidade de Filmes',
        data: Object.values(categorias),
        backgroundColor: [
          'rgb(255, 44, 89)',
          'rgb(47, 172, 255)',
          'rgb(255, 197, 50)',
          'rgb(110, 255, 105)',
          'rgb(196, 79, 255)',
          'rgb(255, 160, 64)',
          'rgb(118, 118, 118)',
          'rgb(19, 47, 255)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      radius: '50%',
      padding: 'center',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'white',
            boxWidth: 30, 
            padding: 25,    
            font: {
              size: 15
            }
          }
        },
        title: {
          display: true,
          text: 'Distribuição de Filmes por Categoria',
          color: 'white',
          font: {
            size: 30
          }
        }
      }
    }
  });
}

    // =================================================================
    // Funções específicas para genero.html
    // =================================================================

    $(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const genero = urlParams.get('categoria');

  $('#tituloGenero').text(`Filmes de ${genero}`);

  $.get(`http://localhost:3000/filmes?categoria=${encodeURIComponent(genero)}`, function (filmes) {
    if (filmes.length === 0) {
      $('#mensagem').text("Nenhum filme cadastrado para este gênero.");
    } else {
      filmes.forEach(filme => {
        $('#filmesPorGenero').append(`
          <article class="category-item position-relative">
            <button class="favorite-btn position-absolute top-0 end-0 m-2 btn btn-link p-0" data-id="${filme.id}" aria-label="Favoritar">
              <i class="bi bi-heart fs-4 text-white"></i>
            </button>
            <a href="detalhes.html?id=${filme.id}" class="item-link">
              <div class="filme-item">
                <img src="${filme.imagem}" alt="${filme.titulo}">
                <div class="filme-info">
                  <h3>${filme.titulo}</h3>
                  <p>${filme.descricao}</p>
                </div>
              </div>
            </a>
          </article>
        `);
      });
    }
    marcarFavoritosNaTela();
  }).fail(function () {
    $('#mensagem').text("Erro ao carregar os filmes.");
  });
});




    // =================================================================
    // Funções para pesquisa de filmes
    // =================================================================

document.addEventListener("DOMContentLoaded", () => {
  const inputBusca = document.getElementById("buscaFilmes");
  const btnBuscar = document.getElementById("btnBuscar");
  const container = document.getElementById("filmesContainer");

  if (btnBuscar && inputBusca && container) {
    btnBuscar.addEventListener("click", async () => {
      const termo = inputBusca.value.toLowerCase().trim();

      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar filmes");

        const filmes = await response.json();
        const filtrados = filmes.filter(filme =>
          filme.titulo.toLowerCase().includes(termo) ||
          filme.descricao.toLowerCase().includes(termo)
        );

        if (filtrados.length === 0) {
          container.innerHTML = `<p class="text-white">Nenhum filme encontrado com o termo "<strong>${termo}</strong>".</p>`;
          return;
        }

        let html = "";
        for (let filme of filtrados) {
          html += `
            <article class="category-item position-relative">
              <button class="favorite-btn position-absolute top-0 end-0 m-2 btn btn-link p-0" data-id="${filme.id}" aria-label="Favoritar">
                <i class="bi bi-heart fs-4 text-white"></i>
              </button>
              <a href="detalhes.html?id=${filme.id}" class="item-link">
                <div class="filme-item">
                  <img src="${filme.imagem}" alt="${filme.titulo}">
                  <div class="filme-info">
                    <h3>${filme.titulo}</h3>
                    <p>${filme.descricao}</p>
                  </div>
                </div>
              </a>
            </article>
          `;
        }
        marcarFavoritosNaTela();
        container.innerHTML = html;

      } catch (error) {
        console.error("Erro na busca:", error);
        container.innerHTML = `<p class="text-danger">Erro ao buscar filmes.</p>`;
      }
    });
  }
});

    // =================================================================
    // Funções especificas para favoritos.html
    // =================================================================

// Função para alternar o estado de favorito
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".favorite-btn");
  if (!btn) return;

  e.preventDefault(); // Impede comportamento padrão, como envio de formulário ou navegação de link
  e.stopPropagation(); // Impede a propagação do evento para evitar conflitos com outros manipuladores

  const icon = btn.querySelector("i");
  const filmeId = btn.dataset.id;

  const isFavorito = icon.classList.contains("bi-heart-fill");

  // Alterna as classes do ícone
  icon.classList.toggle("bi-heart-fill", !isFavorito);
  icon.classList.toggle("text-danger", !isFavorito);
  icon.classList.toggle("bi-heart", isFavorito);
  icon.classList.toggle("text-white", isFavorito);

  // Atualiza o estado de favorito (no backend ou localStorage)
  toggleFavoritoFilme(filmeId);
});

// Função assíncrona que adiciona ou remove um filme dos favoritos do usuário logado
async function toggleFavoritoFilme(filmeId) {
  // Recupera o usuário logado do localStorage (onde está salvo como JSON string)
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Se não houver usuário logado, exibe alerta e encerra a função
  if (!usuario) {
    alert("É necessário estar logado para favoritar filmes.");
    return;
  }

  try {
    // Busca os dados atualizados do usuário no backend (JSON Server)
    const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
    const dados = await response.json(); // Converte a resposta em objeto

    // Obtém a lista de filmes favoritos ou um array vazio caso ainda não exista
    let favoritos = dados.favoritos || [];

    // Verifica se o filme já está nos favoritos
    if (favoritos.includes(filmeId)) {
      // Se estiver, remove o filme da lista
      favoritos = favoritos.filter(id => id !== filmeId);
    } else {
      // Se não estiver, adiciona o filme à lista
      favoritos.push(filmeId);
    }

    // Atualiza a lista de favoritos do usuário no backend com um PATCH
    await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      method: "PATCH", // Apenas atualiza o campo 'favoritos', sem sobrescrever o restante
      headers: { "Content-Type": "application/json" }, // Define o tipo de conteúdo enviado
      body: JSON.stringify({ favoritos }) // Envia os favoritos atualizados no corpo da requisição
    });

  } catch (error) {
    // Em caso de erro (como falha na conexão), exibe no console
    console.error("Erro ao atualizar favoritos:", error);
  }
}

async function marcarFavoritosNaTela() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  try {
    const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
    const dados = await response.json();
    const favoritos = dados.favoritos || [];

    // Percorre todos os botões de favorito
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      const icon = btn.querySelector("i");
      const filmeId = btn.dataset.id;

      if (favoritos.includes(filmeId)) {
        // Marca visualmente como favorito
        icon.classList.add("bi-heart-fill", "text-danger");
        icon.classList.remove("bi-heart", "text-white");
      } else {
        // Garante que não está marcado por engano
        icon.classList.remove("bi-heart-fill", "text-danger");
        icon.classList.add("bi-heart", "text-white");
      }
    });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
  }
}

// Carrega os filmes favoritos e exibe na página
document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("favoritosContainer");
  if (!container) return; // se não existir o container, não faz nada

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    container.innerHTML = `<p class="text-white">É necessário estar logado para ver favoritos.</p>`;
    return;
  }

  try {
    // Busca os dados do usuário para pegar os favoritos
    const responseUser = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
    if (!responseUser.ok) throw new Error("Erro ao buscar usuário");
    const dadosUsuario = await responseUser.json();

    const favoritos = dadosUsuario.favoritos || [];
    if (favoritos.length === 0) {
      container.innerHTML = `<p class="text-white">Nenhum filme marcado como favorito.</p>`;
      return;
    }

    // Busca todos os filmes
    const responseFilmes = await fetch("http://localhost:3000/filmes");
    if (!responseFilmes.ok) throw new Error("Erro ao buscar filmes");
    const filmes = await responseFilmes.json();

    // Filtra apenas os filmes que estão na lista de favoritos
    const filmesFavoritos = filmes.filter(filme => favoritos.includes(filme.id.toString()) || favoritos.includes(filme.id));

    if (filmesFavoritos.length === 0) {
      container.innerHTML = `<p class="text-white">Nenhum filme marcado como favorito.</p>`;
      return;
    }

    // Gera o HTML para exibir os filmes favoritos
    let html = "";
    for (let filme of filmesFavoritos) {
      html += `
        <article class="category-item position-relative">
          <button class="favorite-btn position-absolute top-0 end-0 m-2 btn btn-link p-0" data-id="${filme.id}" aria-label="Favoritar">
            <i class="bi bi-heart-fill fs-4 text-danger"></i>
          </button>
          <a href="detalhes.html?id=${filme.id}" class="item-link">
            <div class="filme-item">
              <img src="${filme.imagem}" alt="${filme.titulo}">
              <div class="filme-info">
                <h3>${filme.titulo}</h3>
                <p>${filme.descricao}</p>
              </div>
            </div>
          </a>
        </article>
      `;
    }

    container.innerHTML = html;

    // Marca os favoritos na tela (ajusta os ícones se necessário)
    marcarFavoritosNaTela();

  } catch (error) {
    console.error("Erro ao carregar filmes favoritos:", error);
    container.innerHTML = `<p class="text-danger">Erro ao carregar filmes favoritos.</p>`;
  }
});


  // =================================================================
  // Funçõe especifica para controlar a exibição do botão de cadastro
  // =================================================================

  function controlarBotaoCadastro() {
  const usuarioStr = localStorage.getItem('usuarioLogado');
  const cadastroLink = document.querySelector('nav.nav-menu a[href="cadastro_filmes.html"]');

  // Se não tem usuário logado, ou usuário não é admin, esconde o link
  if (!usuarioStr) {
    cadastroLink.style.display = 'none';
    return;
  }

  const usuario = JSON.parse(usuarioStr);

  if (usuario.admin) {
    cadastroLink.style.display = 'inline-block'; // mostra só se for admin
  } else {
    cadastroLink.style.display = 'none'; // esconde se não for admin
  }
}

window.addEventListener('DOMContentLoaded', controlarBotaoCadastro);