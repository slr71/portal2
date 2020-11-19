import React, {useEffect, createRef} from "react"
import lottie from 'lottie-web'
//import { makeStyles } from '@material-ui/core'
import animation from '../animations/scientist.json'

import styles from '../../src/styles/animation.module.css'
const Animation = () => {
  let animationContainer = createRef();
  
  useEffect(() => {
    lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation
    });
  }, []);

  return (
    <div className={styles.animationBox} ref={animationContainer} />
  );
};

export default Animation;