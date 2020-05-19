import api from './api';

class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.querySelector('#repo-form');
    this.inputEl = document.querySelector('input[name=repository]');
    this.listEl = document.querySelector('#repo-list');
    
    this.registerHandlers();
  }

  //Registra os eventos
  registerHandlers(){
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  //Coloca um texto carregando enquanto busca da api
  setLoading(loading = true){
    if(loading === true){
      let loadingEl = document.createElement('span');
      loadingEl.appendChild(document.createTextNode('Carregando'));
      loadingEl.setAttribute('id', 'loading');

      this.formEl.appendChild(loadingEl);
    } else {
      document.querySelector('#loading').remove();
    }
  }

  async addRepository(event){
    //Não deixa o submit do formulário recarregar a página
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if(repoInput.lenght === 0){
      return;
    }

    this.setLoading();

    try {
      const response = await api.get(`/repos/${repoInput}`);

      const { name, description, html_url, owner: { avatar_url } } = response.data;


      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = '';

      this.listEl.classList.remove('hide');

      this.render();
    } catch(err) {
      alert('O repositório não existe');
    }

    this.setLoading(false);
  }

  render(){
    this.listEl.innerHTML = '';

    this.repositories.forEach(repo => {

      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.avatar_url);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.description));


      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', repo.html_url);
      linkEl.appendChild(document.createTextNode('Acessar'));

      let hrEl = document.createElement('hr');

      let listItem = document.createElement('li');
      listItem.appendChild(imgEl);
      listItem.appendChild(titleEl);
      listItem.appendChild(descriptionEl);
      listItem.appendChild(linkEl);

      this.listEl.appendChild(listItem);
      this.listEl.appendChild(hrEl);
      
    })
  }
}

new App;