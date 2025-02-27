import React, {useEffect, createRef} from "react"
import lottie from 'lottie-web'
import { makeStyles } from '../styles/tss'
import animation from '../animations/erroranimation.json'

const useStyles = makeStyles()((theme) => ({
  animationBox: {
    maxWidth:'560px',
    margin: '0 auto',
    marginTop:'10px',
  },
}))

const Animation = () => {
  let animationContainer = createRef();
  
  const { classes } = useStyles()

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
    <div className={classes.animationBox} ref={animationContainer} />
  );
};

export default Animation;