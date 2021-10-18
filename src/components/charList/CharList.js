import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210, 
        charEnded: false
    }
    marvelService = new MarvelService();
    
    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {

        let ended =false;
        if(newCharList.length < 9) {
            ended =true;
        }

        this.setState(({offset, charList}) => ({
            charList:[...charList, ...newCharList], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended

        }))

    }
    
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {

        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    transformImgStyle = (n) => {
        let imgStyle = {'objectFit' : 'cover'};
        if (n === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'};
        }
        return imgStyle;
    }

    
    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const elements = charList.map((item, i) => {

            return (
                <li 
                    key={item.id}
                    ref={this.setRef} 
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);}} 
                    className="char__item"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt="abyss" style={this.transformImgStyle(item.thumbnail)}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
            
        })

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {elements}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display' : charEnded ? 'none' : 'block'}}>
                        
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;