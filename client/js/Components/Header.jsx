import React from 'react';

const Header = (props) => {
    return (
        <header className="c-header">
            <button className="c-header__menu-button" onClick={props.handleToggleOptions}><i className={`fas fa-${props.areOptionsOpen ? 'times' : 'bars'}`}></i></button>
            <h1 className="c-header__title">No-Dice</h1>
        </header>
    );
};

export default Header;
