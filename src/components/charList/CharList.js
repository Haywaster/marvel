import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {error, loading, getAllCharacters} = useMarvelService();

    useEffect(() => onRequest(offset, true), [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList])
        setNewItemsLoading(false)
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRef = useRef([]);

    const focusOnItem = (id) => {
        itemRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRef.current[id].classList.add('char__item_selected');
        itemRef.current[id].focus();
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    tabIndex={0}
                    ref={el => itemRef.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id)
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                    className="char__item"
                    key={item.id}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    
                </li>
            )
        });
        // Конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null;
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                style={{'display': charEnded ? 'none' : 'block'}} 
                disabled={newItemsLoading}
                onClick={() => onRequest(offset)}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;