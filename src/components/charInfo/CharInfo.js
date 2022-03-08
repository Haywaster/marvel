import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const {error, loading, getCharacter, clearError} = useMarvelService();

    useEffect(() => updateChar(), [props.charId])

    const updateChar = () => {
        const {charId} = props
        if(!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

    const spinner = loading ? <Spinner/> : null,
            errorMessage = error ? <ErrorMessage/> : null,
            content = !(loading || error || !char) ? <View char={char}/> : null,
            skeleton = error || char || loading ? null : <Skeleton/>;

    return (
        <div className="char__info">
            {spinner}
            {errorMessage}
            {content}
            {skeleton}
        </div>
    )
}

const View = (props) => {

    const {name, description, thumbnail, homepage, wiki, comics} = props.char
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img style={imgStyle} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "There isn't information about this character"} 
                {
                    comics.splice(0, 10).map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;