import React from 'react';

import { CurrentUserContext } from '../context/CurrentUserContext';
import api from '../utils/Api';

import Header from './Header';
import Main from './Main'
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';


function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    const [selectedCard, setSelectedCard] = React.useState({})
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false)

    function handleCardClick(card) {
        setSelectedCard(card)
        setIsImagePopupOpen(true)

    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsImagePopupOpen(false);
    }

    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);

    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([data, card]) => {
                setCurrentUser(data);
                setCards(card)
            })
            .catch(error => console.log(error))
    }, []);

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(error => console.log(error))
    }
    
    
    function handleUpdateUser(data) {
        api.patchUserInfo(data)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(error => console.log(error))
    }

    function handleUpdateAvatar(data) {
        api.patchUserAvatar(data)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(error => console.log(error))
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => { 
                setCards((state) => state.filter((c) => c._id !== card._id));
            })
            .catch(error => console.log(error))
    }

    function handleAddPlaceSubmit({name, link}) {
        api.createCard({name, link})
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch(error => console.log(error))
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
    
    <div className="page">

        <Header />

        <Main 

        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        cards={cards}
        onCardDelete={handleCardDelete}
        />

        <Footer />

        {/* Профиль */ }
        <EditProfilePopup 
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}/>

        {/* Карточки */}
        <AddPlacePopup 
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddCard={handleAddPlaceSubmit}/>

        {/* Аватар */}
        <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}/>

        {/* Подтверждение */}
        <PopupWithForm
        name={'confirm'}
        title={'Вы уверены?'}
        buttonText={'Да'}>
        </PopupWithForm>

        <ImagePopup 
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
        card={selectedCard}/>
        

        
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
