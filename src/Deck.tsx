import React, { useDeferredValue, useEffect, useState } from "react";
import {
  useSprings,
  animated,
  to as interpolate,
  SpringValues,
  Lookup,
  useSpring,
  a,
} from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { getDeck, drawCards, getFortuneTelling } from "./tarotDeck.js";

import styles from "./styles.module.css";
import Card from "./Card";
import Emoji from "react-emoji-render";
import pokerSound from "./poker2.mp3";
import io from "socket.io-client";
import Typewriter from "typewriter-effect";

let tarotDeck = getDeck();
let cardsSelected: string[] = [];
const sound = new Audio(pokerSound);
sound.playbackRate = 3.5;
// const URL = "http://127.0.0.1:5000";
// const socket = io(URL);

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: i * 150 - (cardsSelected.length - 1) * 75,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

type UseSpringsReturn<Item extends Lookup<any> = any> = [
  SpringValues<Item>[],
  (
    config: ((i: number, ctrl: any) => any) | any,
    extra?: { [key: string]: any }
  ) => void
];

function Deck() {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out

  const [props, api] = useSprings(cardsSelected.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!down && gone.size === cardsSelected.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <Card
            card={cardsSelected[i]}
            index={i}
            style={{ rot, scale, trans }}
            bind={bind}
          />
        </animated.div>
      ))}
    </>
  );
}

export default function App() {
  const [deckKey, setDeckKey] = useState(Date.now());
  const [quest, setQuest] = useState("");
  const seed = {};
  const [message, setMessage] = useState("");
  const [displayedMessage, setDisplayedMessage] = useState("");

  const handleDrawCards = () => {
    cardsSelected = drawCards(3, tarotDeck);
    setDeckKey(Date.now());
    sound.play();
  };

  const handleFortuneTelling = () => {
    seed["quest"] = quest;
    seed["cards"] = cardsSelected;
    const response = getFortuneTelling(seed);
    console.log(response);
  };

  // const handleFortuneTellingStreaming = () => {
  //   seed["quest"] = quest;
  //   seed["cards"] = cardsSelected;
  //   socket.emit("chat_message", seed);
  // };

  const handleInput = (e) => {
    setQuest(e.target.value);
  };

  // useEffect(() => {
  //   // add a listener for the chat_message event
  //   socket.on("chat_message", (data) => {
  //     setMessage((prevMessage) => prevMessage + data.response);
  //   });

  //   return () => {
  //     // remove the listener when the component unmounts
  //     socket.off("chat_message");
  //   };
  // }, []);

  // useEffect(() => {
  //   // display message one character at a time using setInterval
  //   let index = 0;
  //   const intervalId = setInterval(() => {
  //     // add one character to displayedMessage
  //     setDisplayedMessage((prevMessage) => prevMessage + message.charAt(index));
  //     index++;
  //     // clear interval when all characters have been displayed
  //     if (index >= message.length) {
  //       clearInterval(intervalId);
  //     }
  //   }, 200); // set interval delay, adjust as desired for typing speed

  //   return () => {
  //     // clear interval when component unmounts
  //     clearInterval(intervalId);
  //   };
  // }, [message]);

  return (
    <div className={styles.container}>
      <input className={styles.input} onChange={handleInput} />
      <Deck key={deckKey} />
      <div className={styles.button}>
        <div>
          <a href="#" onClick={handleDrawCards} className={styles.emoji}>
            <Emoji text="🃏" />
          </a>
        </div>
        <div>
          <a href="#" onClick={handleFortuneTelling} className={styles.emoji}>
            <Emoji text="🧿" />
          </a>
        </div>
        {/* <div>
          <a
            href="#"
            onClick={handleFortuneTellingStreaming}
            className={styles.emoji}
          >
            <Emoji text="🧿" />
          </a>
        </div> */}
      </div>
      {/* <Typewriter
        onInit={(typewriter) => {
          typewriter
            .changeDelay("natural")
            .typeString("首先是The High Priestess。 正位时，这张牌代表着谜团、智慧和神秘。在这个问题中，它可能意味着市场上存在许多未知的因素和隐秘的力量，这些因素可能会对A股的走势产生影响。建议你要保持警惕，密切关注市场动态，并做好必要的准备，以维护你的投资收益。")
            .callFunction(() => {
              console.log("String typed out!");
            })
            .pauseFor(2500)
            .deleteAll()
            .callFunction(() => {
              console.log("All strings were deleted");
            })
            .start();
        }}
      /> */}
    </div>
  );
}
