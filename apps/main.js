let livros = [];

const endpointDaApi = 'https://guilhermeonrails.github.io/casadocodigo/livros.json'
getBuscaLivrosDaAPI()

const elementoParaInserirLivros = document.getElementById("livros")
const elementoComValorTotalDeLivrosDisponivel = document.getElementById("valor_total_livros_disponiveis")

async function getBuscaLivrosDaAPI() {
  const res = await fetch(endpointDaApi);
  livros = await res.json();
  let livroComDesconto = aplicarDesconto(livros)
  exibirOsLivrosNaTela(livroComDesconto)
}

function exibirOsLivrosNaTela(listaDeLivros) {
  elementoComValorTotalDeLivrosDisponivel.innerHTML = ''
  elementoParaInserirLivros.innerHTML = ''
  listaDeLivros.forEach(livro => {
    let disponibilidade = livro.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel'
    elementoParaInserirLivros.innerHTML += `
      <div class="livro">
      <img class="${disponibilidade}" src="${livro.imagem}"
        alt="${livro.alt}" />
      <h2 class="livro__titulo">
        ${livro.titulo}
      </h2>
      <p class="livro__descricao">${livro.autor}</p>
      <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
      <div class="tags">
        <span class="tag">${livro.categoria}</span>
      </div>
    </div>
      `
  })
}

function aplicarDesconto(livros) {
  const desconto = 0.3;
  livroComDesconto = livros.map(livro => {
    return { ...livro, preco: livro.preco - (livro.preco * desconto) }
  })
  return livroComDesconto
}

const botoes = document.querySelectorAll(".btn")
botoes.forEach(botao => botao.addEventListener('click', filtrarLivros))


function filtrarLivros() {
  const elementoBtn = document.getElementById(this.id)
  const categoria = elementoBtn.value
  let livrosFiltrados = categoria == 'disponivel' ? filtrarPorDisponibilidade() : filtrarPorCategoria(categoria)
  exibirOsLivrosNaTela(livrosFiltrados)
  if (categoria == 'disponivel') {
    const valorTotal = calcularValorTotalDisponivel(livrosFiltrados)
    exibirValorDeLivrosDisponivelNaTela(valorTotal)
  }
}

const ordenarPorPreco = document.getElementById("btnOrdenarPorPreco")
ordenarPorPreco.addEventListener("click", ordenarLivrosPorPreco)

function filtrarPorCategoria(categoria) {
  return livros.filter(livro => livro.categoria == categoria);
}

function filtrarPorDisponibilidade() {
  return livros.filter(livro => livro.quantidade > 0);
}

function ordenarLivrosPorPreco() {
  let livrosOrdenados = livros.sort((a, b) => a.preco - b.preco)
  exibirOsLivrosNaTela(livrosOrdenados)
}

function exibirValorDeLivrosDisponivelNaTela(valorTotal) {
  elementoComValorTotalDeLivrosDisponivel.innerHTML = `
  <div class="livros__disponiveis">
      <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal}</span></p>
    </div>
  `
}

function calcularValorTotalDisponivel(livros){
  return livros.reduce((acc, livro) => acc + livro.preco, 0).toFixed(2)
}

