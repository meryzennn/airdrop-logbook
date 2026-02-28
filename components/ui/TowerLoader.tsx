"use client";

import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="box box-1">
          <div className="side-left" />
          <div className="side-right" />
          <div className="side-top" />
        </div>
        <div className="box box-2">
          <div className="side-left" />
          <div className="side-right" />
          <div className="side-top" />
        </div>
        <div className="box box-3">
          <div className="side-left" />
          <div className="side-right" />
          <div className="side-top" />
        </div>
        <div className="box box-4">
          <div className="side-left" />
          <div className="side-right" />
          <div className="side-top" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* 3D tower loader made by: csozi | Website: www.csozi.hu */

  .loader {
    position: relative;
    height: 50px;
    width: 40px;
    transform: scale(3);
    transform-origin: center;
  }

  .box {
    position: relative;
    opacity: 0;
    left: 10px;
    /* pastiin gak kepengaruh transform lain */
    will-change: transform, opacity;
  }

  .side-left {
    position: absolute;
    background-color: #28b576;
    width: 19px;
    height: 5px;
    transform: skew(0deg, -25deg);
    top: 14px;
    left: 10px;
  }

  .side-right {
    position: absolute;
    background-color: #0ac263bc;
    width: 19px;
    height: 5px;
    transform: skew(0deg, 25deg);
    top: 14px;
    left: -9px;
  }

  /* FIX: rotate + skew harus digabung di transform */
  .side-top {
    position: absolute;
    background-color: #08f453;
    width: 20px;
    height: 20px;
    transform: rotate(45deg) skew(-20deg, -20deg);
  }

  .box-1 {
    animation: from-left 4s infinite;
  }

  .box-2 {
    animation: from-right 4s infinite;
    animation-delay: 1s;
  }

  .box-3 {
    animation: from-left 4s infinite;
    animation-delay: 2s;
  }

  .box-4 {
    animation: from-right 4s infinite;
    animation-delay: 3s;
  }

  /* FIX: translate: -> transform: translate() */
  @keyframes from-left {
    0% {
      z-index: 20;
      opacity: 0;
      transform: translate(-20px, -6px);
    }
    20% {
      z-index: 10;
      opacity: 1;
      transform: translate(0px, 0px);
    }
    40% {
      z-index: 9;
      transform: translate(0px, 4px);
    }
    60% {
      z-index: 8;
      transform: translate(0px, 8px);
    }
    80% {
      z-index: 7;
      opacity: 1;
      transform: translate(0px, 12px);
    }
    100% {
      z-index: 5;
      opacity: 0;
      transform: translate(0px, 30px);
    }
  }

  @keyframes from-right {
    0% {
      z-index: 20;
      opacity: 0;
      transform: translate(20px, -6px);
    }
    20% {
      z-index: 10;
      opacity: 1;
      transform: translate(0px, 0px);
    }
    40% {
      z-index: 9;
      transform: translate(0px, 4px);
    }
    60% {
      z-index: 8;
      transform: translate(0px, 8px);
    }
    80% {
      z-index: 7;
      opacity: 1;
      transform: translate(0px, 12px);
    }
    100% {
      z-index: 5;
      opacity: 0;
      transform: translate(0px, 30px);
    }
  }
`;

export default Loader;
