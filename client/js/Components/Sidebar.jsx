import React from 'react';

const Sidebar = (props) => {
    return (
        <div className="c-sidebar">
            <h1 className="c-sidebar__title"><strong>No-Dice</strong></h1>
            <div className="form-field">
                <label className="form-field__label">Number of dice</label>
                <input className="o-box--small form-field__input" type="number" value={props.totalDice === 0 ? null : props.totalDice} onChange={props.handleChangeNumberOfDice} />
            </div>
        </div>
    );
};

export default Sidebar;
