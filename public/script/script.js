'use strict';

class Card {
  constructor(data){
    this.data = data;
    this.name = data.name;
    this.link = data.link;
    this.likeCount = data.likes.length;
    this.like = this.like.bind(this);
    this.remove = this.remove.bind(this);
    this.popup = this.popup.bind(this);
    this.card = this.create();
    this.card.querySelector('.place-card__like-icon').addEventListener('click', this.like);
    if (this.data.owner._id == 'c1f635ecaccb61eaa3e06ae0'){
      this.card.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    }
    this.card.querySelector('.place-card__image').addEventListener('click', this.popup)

  }
  
  //сборка карточки
  create() {
    const placeCard = document.createElement('div');
    const placeCardDelete = document.createElement('button');
    const placeCardDescription = document.createElement('div');
    const placeCardName = document.createElement('h3');
    const placeCardLike = document.createElement('button');
    const placeCardLikeCount = document.createElement('p');
    const placeCardImage = document.createElement('div');

    placeCardImage.classList.add('place-card__image')
    placeCardDelete.classList.add('place-card__delete-icon');
    placeCardDescription.classList.add('place-card__description');
    placeCardLike.classList.add('place-card__like-icon');
    for(let i=0; i<= this.data.likes.length-1; i++){  
      if(this.data.likes[i]._id == 'c1f635ecaccb61eaa3e06ae0'){
        placeCardLike.classList.add('place-card__like-icon_liked');
      }
    }
    placeCardLikeCount.classList.add('place-card__like-count');
    placeCardName.classList.add('place-card__name');
    placeCard.classList.add('place-card');
    placeCardImage.setAttribute('style',`background-image: url(${this.link})`);
    placeCardLikeCount.textContent = this.likeCount;
    placeCardName.textContent = this.name;
    if (this.data.owner._id == 'c1f635ecaccb61eaa3e06ae0'){
      placeCardImage.appendChild(placeCardDelete);
    }
    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(document.createElement('div'));
    placeCardDescription.querySelector('div').appendChild(placeCardLike);
    placeCardDescription.querySelector('div').appendChild(placeCardLikeCount);
    placeCard.appendChild(placeCardImage);
    placeCard.appendChild(placeCardDescription);
    return placeCard;
  }
  //лайк лайк лайк
  like(event){
    if (event.target.classList.contains('place-card__like-icon_liked')){
      api.editLikeCount(this.data._id, 'DELETE' , event.target).then((data)=>{
        this.card.querySelector('.place-card__like-count').textContent = data;
      });
    }else {
      api.editLikeCount(this.data._id, 'PUT', event.target).then((data)=>{
        this.card.querySelector('.place-card__like-count').textContent = data;
      });
    }
  }
  //удаление
  remove(event){
    event.stopPropagation();
    if (window.confirm('Точно удалить?')){
      api.deleteCard(this.data._id);
      this.card.parentNode.removeChild(this.card);
    }
  }
  //поп ап который в карточке
  popup(event){
    event.stopPropagation();
    document.querySelector('.popup__photo').setAttribute('src', this.link)
    document.querySelector('.photo-popup').classList.add('popup_is-opened');
  }
}

//контейнер карточек
class CardList{
  constructor (domContainer, cardArray) {
    this.domContainer = domContainer;
    this.cardArray = cardArray;
    this.render();

  }

  render(){
    this.cardArray.forEach((data) => {
      const cardElem = new Card(data);
      this.addCard(cardElem.card);
    })
  }

  addCard(card){
    this.domContainer.appendChild(card);
  }
}

class Popup {
  constructor(popupElement, openButton){
    this.popupElement = popupElement;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    openButton.addEventListener('click', this.open);
    popupElement.querySelector('.popup__close').addEventListener('click', this.close);
  }

  open(){
    this.popupElement.classList.add('popup_is-opened');
  }

  close(){
    this.popupElement.classList.remove('popup_is-opened');
  }
}

class ChangeNamePopup extends Popup {
  constructor(popupElement, openButton){
    super(popupElement, openButton);
    this.submit = this.submit.bind(this);
    this.setupProfileData = this.setupProfileData.bind(this);
    this.popupElement.addEventListener('submit', this.submit);
  }

  open(){
    document.forms.edit.name.value = document.querySelector('.user-info__name').textContent;
    document.forms.edit.aboutOneself.value = document.querySelector('.user-info__job').textContent;
    super.open();
  }

  submit(event){
    event.preventDefault();
    api.editUserData(document.forms.edit.name.value, document.forms.edit.aboutOneself.value);
    event.target.parentElement.querySelector('.button').setAttribute('disabled', true);
  }

  setupProfileData(name, about, link){
    document.querySelector('.user-info__name').textContent = name;
    document.querySelector('.user-info__job').textContent = about;
    document.querySelector('.user-info__photo').style.backgroundImage = `url('${link}')`
  }
}

class AddCardPopup extends Popup{
  constructor(popupElement, openButton){
    super(popupElement, openButton);
    this.submit = this.submit.bind(this);
    this.popupElement.addEventListener('submit', this.submit);
  }
  submit(){
    event.preventDefault();
    api.addCard(document.forms.form.elements.first.value, document.forms.form.elements.second.value);
    document.forms.form.elements.first.value = '';
    document.forms.form.elements.second.value = '';
    event.target.querySelector('.button').setAttribute('disabled', true);
  }
  
}

class ChangeAvatarPopup extends Popup {
  constructor(popupElement, openButton){
    super(popupElement, openButton);
    this.submit = this.submit.bind(this);
    this.popupElement.addEventListener('submit', this.submit)
  }

  submit(event){
    event.preventDefault();
    api.changeAvatar(document.forms.avatar.elements.link.value);
  }
}

class Api {
  constructor(options){
    this.options = options;
  }

  getUserData() {
    fetch(this.options.baseUrl+'/users/me', Object.assign({}, this.options.header))
      .then(statusRequest)
      .then(data => {
        formPopup.setupProfileData(data.name, data.about, data.avatar);
      })
      .catch(err=>console.log(err));
  }

  editUserData(name, about){
    document.querySelector('.popup__edit-button').textContent = 'Загрузка...';
    fetch(this.options.baseUrl+'/users/me', Object.assign({method: 'PATCH'}, this.options.header, {body: Promise.stringify({
      name: name,
      about: about
    })}))
      .then(statusRequest)
      .then(data=>{
        formPopup.setupProfileData(data.name, data.about, data.avatar);
      })
      .catch(err=>{console.log('edit user data ERROR :', err);})
      .finally(()=>{
        document.querySelector('.popup__edit-button').textContent = 'Сохранить';
        formPopup.close();
      })
  }

  getCards() {
    fetch(this.options.baseUrl+'/cards',  this.options.header)
      .then(statusRequest)
      .then(data => {
        cardContainer = new CardList(document.querySelector('.places-list'), data);
      })
      .catch(err => console.log('getCard ERROR :', err));
  }

  addCard(name, link) {
    document.querySelector('#addButton').textContent = 'Загрузка...';
    document.querySelector('#addButton').classList.add('popup__edit-button');
    
    fetch(this.options.baseUrl+'/cards', Object.assign({method: 'POST'}, this.options.header, {body: JSON.stringify({
      name: name,
      link: link
    })}))
      .then(statusRequest)
      .then(data => {
        const card = new Card(data);
        cardContainer.addCard(card.card);
      })
      .catch(err => console.log('addCard ERROR :', err))
      .finally(()=> {
        document.querySelector('#addButton').textContent = '+';
        document.querySelector('#addButton').classList.remove('popup__edit-button');
        addPopuop.close();
      })
  }

  deleteCard(id){
    fetch(this.options.baseUrl+'/cards/'+id, Object.assign({method: 'DELETE'}, this.options.header))
      .then(statusRequest)
      .then(data => console.log('data :', data))
      .catch(err => console.log('deleteCard ERROR :', err))
  }

  editLikeCount(id, method, card) {
    return fetch(this.options.baseUrl+'/cards/like/'+id, Object.assign({method: method}, this.options.header))
      .then(statusRequest)
      .then(data => {
        card.classList.toggle('place-card__like-icon_liked');
        return data.likes.length;
      })
      .catch((err)=> {
        console.log('editLikeCount ERROR : :', err);
      })
  }

  changeAvatar(link){
    document.querySelector('#avatarSubmit').setAttribute('disabled', true);
    document.querySelector('#avatarSubmit').textContent = 'Загрузка...';
  
    fetch(this.options.baseUrl+'/users/me/avatar',Object.assign({method: 'PATCH'}, this.options.header, {body:JSON.stringify({avatar: link})}))
    .then(statusRequest)
    .then(data => {
      document.querySelector('.user-info__photo').style.backgroundImage = `url('${data.avatar}')`;
    })
    .catch(err => {
      console.log('changeAvatar ERROR : :', err);
    })
    .finally(()=> {
      document.querySelector('#avatarSubmit').textContent = 'Сохранить';
      avatarPopup.close();
      document.querySelector('#avatarSubmit').removeAttribute('disabled', true);
    })

  }
}
//функция проверки запроса
function statusRequest(res) {
  if (res.ok) {
    return res.json();
  } return Promise.reject(res);
}
/*валидацию вынес в отдельную функцию, что бы не вешать проверку каждый раз при открытии popup, 
если поля будут развиваться, можно будет сделать частью классов, наверное
*/
function inputMessage(elem) {
  if (elem.validity.valueMissing){
    elem.nextElementSibling.textContent = 'Это обязательное поле';
  }else if (elem.validity.typeMismatch) {
    elem.nextElementSibling.textContent = 'Здесь должна быть ссылка';
  } else if ((elem.validity.tooLong) || (elem.validity.tooShort)) {
    elem.nextElementSibling.textContent = `Должно быть от 2 до 30 символов`;
  } else {
    elem.nextElementSibling.textContent = '';
  }
}
    
function validity(event){
  const inputs = Array.from(event.target.parentElement.elements);
  let check = true;
  inputMessage(event.target);

  inputs.forEach((elem)=>{
    if (elem.type !== 'submit'){
      if (!elem.checkValidity()) check=false;
    }
  })

  if (check) {
    event.target.parentElement.querySelector('.button').removeAttribute('disabled', true);
  }else {
    event.target.parentElement.querySelector('.button').setAttribute('disabled', true);
  }
    }

//вызов конструкторов
const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort3',
  header:{
    headers: {
      authorization: '4cdd9b84-dfe4-4ccc-942e-84e8ca2336ab',
      'Content-Type': 'application/json'
    }
  }
})
let cardContainer = '';
const formPopup = new ChangeNamePopup(document.querySelector('.edit-popup'), document.querySelector('.user-info__edit-button'));
const addPopuop = new AddCardPopup(document.querySelector('.add-popup'), document.querySelector('.user-info__button'));
const avatarPopup = new ChangeAvatarPopup(document.querySelector('.avatar-popup'), document.querySelector('.user-info__photo'));


api.getUserData();
api.getCards();

document.querySelector('.photo-popup').querySelector('.popup__close').addEventListener('click', () => {
  document.querySelector('.photo-popup').classList.remove('popup_is-opened');

})

document.querySelector('.root').addEventListener('input', validity);

//У меня, почему то, поехала верстка, при наведении мышки на изображение в карточки .place-card__image::after стал 
//появляться ровно под изображением и перекрывал .place-card__description. 
//Пришлось добавить ему position: absolute и расположение... но очень интересно из-за чего это происходило

/*самое трудоемкое было настроить смену колличества лайков, когда нажимаешь на лайк. this внутри fetch(then) указывает не 
на место вызова, а на место сборки класса, в связи с этим внутри then поменять кол-во лайков на актуально не получалось.
Потом не мог понять как вытащить PromiseValue... Но сладость побеты этого стоила))
*/





