import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.pi = Math.PI;
    }

    render () {
        const {angle} = this.props;
        const a = angle % 360;
        const r = (a * this.pi / 180),
            x = Math.sin(r) * 125,
            y = Math.cos(r) * -125,
            mid = (a > 180) ? 1 : 0,
            anim = `M 0 0 v -125 A 125 125 1 ${mid} 1 ${x} ${y} z`;
        return (
            <svg width="250" height="250" viewbox="0 0 250 250">
                <path
                    style={{ fill: '#00517a' }}
                    transform="translate(125, 125)"
                    d={anim}
                />
                <path
                    style={{ fill: '#0088cc' }}
                    transform="translate(125, 125) scale(.84)"
                    d={anim}
                />
            </svg>
        );
    }
}

export default Timer;
