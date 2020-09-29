import React, {useEffect, createRef} from "react"
import lottie from 'lottie-web'
import { makeStyles } from '@material-ui/core'
import animation from '../animations/floatguy.json'

const useStyles = makeStyles((theme) => ({
  animationBox: {
    maxWidth:'50%',
  },
}))

const Animation = () => {
  let animationContainer = createRef();
  
  const classes = useStyles()

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