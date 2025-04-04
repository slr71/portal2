import React, { useEffect, createRef } from "react";
import lottie from "lottie-web";
import { styled } from "@mui/material/styles";
import animation from "../animations/error500.json";

const AnimationBox = styled('div')(({ theme }) => ({
  maxWidth: "470px",
  margin: "0 auto",
  marginTop: "10px",
}));

const Animation = () => {
  let animationContainer = createRef();

  useEffect(() => {
    lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation,
    });
  }, []);

  return <AnimationBox ref={animationContainer} />;
};

export default Animation;