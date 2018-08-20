import React from 'react';
import classnames from 'classnames';

export default class Dice extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const value = this.props.value > 6
            ? 6
            : this.props.value < 1
                ? 1
                : this.props.value;
        let textValue = 'one';
        switch(value) {
            case 1:
                break;
            case 2: 
                textValue = 'two';
                break;
            case 3:
                textValue = 'three';
                break;
            case 4:
                textValue = 'four';
                break;
            case 5:
                textValue = 'five';
                break;
            case 6:
                textValue = 'six';
                break;
        }
        const classNames = ['dice', 'fas'];
        classNames.push(`fa-dice-${textValue}`);

        return (
            <i className={classnames(classNames)} onClick={this.handleClick}></i>
        );
    }

    handleClick(e) {
        const {index, onClick} = this.props;
        onClick(index);
    }
}
