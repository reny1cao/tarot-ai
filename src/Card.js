import React from 'react';
import './Card.css'
import { animated, to as interpolate, useSpring } from "@react-spring/web";

import styles from "./styles.module.css";

function Card({ card, index, style, bind }) {
    const [isFlipped, setIsFlipped] = React.useState(false);
    const { transform, opacity } = useSpring({
        opacity: isFlipped ? 1 : 0,
        transform: `perspective(600px) rotateX(${isFlipped ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
      })
    function handleClick() {
        setIsFlipped(!isFlipped);
        console.log("clicked")
    }

    return (
        <animated.div
            className="card"
            style={{ ...style, transform: interpolate([style.rot, style.scale], style.trans) }}
            onClick={handleClick}
        >
            <animated.div>{card.name}</animated.div>
            <animated.div
                className={`${styles.c} ${styles.back}`}
                style={{ opacity: opacity.to(o => 1 - o), transform, backgroundImage: `url(${process.env.PUBLIC_URL}${card.path})` }}
                
                {...bind(index)}
            />
            <animated.div
                className={`${styles.c} ${styles.front}`}
                style={{
                    opacity,
                    transform,
                    rotateX: '180deg',
                    backgroundImage: `url(public/images/deck/02_High_Priestess.jpg)`
                }}
                {...bind(index)}
            />
            
        </animated.div>
    );
}

export default Card