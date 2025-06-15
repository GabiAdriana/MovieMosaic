/*=================================================
    Login Script
================================================*/

document.addEventListener('DOMContentLoaded', function () {
  // Botão de cadastro
  document.getElementById('btn_salvar').addEventListener('click', function (event) {
    event.preventDefault();

    let login = document.getElementById('txt_login').value;
    let nome = document.getElementById('txt_nome').value;
    let email = document.getElementById('txt_email').value;
    let senha = document.getElementById('txt_senha').value;
    let senha2 = document.getElementById('txt_senha2').value;

    console.log({ login, nome, email, senha, senha2 });

    if (senha !== senha2) {
      alert('As senhas informadas não conferem.');
      return;
    }

    addUser(nome, login, senha, email);
  });

  // Formulário de login
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    loginUser(username, password);
  });

  function addUser(nome, login, senha, email) {
    fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        login: login,
        senha: senha,
        email: email,
        admin: false,
        favoritos: []
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar usuário.');
        }
        return response.json();
      })
      .then(data => {
        alert('Usuário cadastrado com sucesso!');
        $('#loginModal').modal('hide');
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao cadastrar usuário.');
      });
  }

  function loginUser(username, password) {
    fetch('http://localhost:3000/usuarios')
      .then(response => response.json())
      .then(users => {
        const user = users.find(u => u.login === username && u.senha === password);
        if (user) {
          localStorage.setItem('usuarioLogado', JSON.stringify(user));
          alert('Login realizado com sucesso!');
          window.location.href = 'index.html';
        } else {
          alert('Usuário ou senha incorretos.');
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao realizar login.');
      });
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