"use client";

import styled from "styled-components";

export default function SocialHubButton({
  href,
  text = "Visit My Socials",
}: {
  href: string;
  text?: string;
}) {
  return (
    <Wrap>
      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
        <button type="button" className="learn-more" aria-label={text}>
          <span className="circle" aria-hidden="true">
            <span className="icon arrow" />
          </span>
          <span className="button-text">{text}</span>
        </button>
      </a>
    </Wrap>
  );
}

const Wrap = styled.div`
  .link {
    display: inline-block;
    text-decoration: none;
  }

  button {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    background: transparent;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  button.learn-more {
    width: 14rem;
    height: 3rem;
  }

  /* circle (default compact) */
  button.learn-more .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: relative;
    display: block;
    margin: 0;
    width: 3rem;
    height: 3rem;

    background: rgba(9, 9, 11, 0.85);
    border-radius: 1.625rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      0 0 0 1px rgba(16, 185, 129, 0.18) inset,
      0 18px 40px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  /* subtle animated glow inside circle */
  button.learn-more .circle::before {
    content: "";
    position: absolute;
    inset: -140%;
    background: conic-gradient(
      from 180deg,
      rgba(16, 185, 129, 0),
      rgba(16, 185, 129, 0.55),
      rgba(59, 130, 246, 0.35),
      rgba(236, 72, 153, 0.28),
      rgba(16, 185, 129, 0)
    );
    filter: blur(18px);
    opacity: 0.55;
    animation: spin 6.5s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* arrow base */
  button.learn-more .circle .icon {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(255, 255, 255, 0.9);
    z-index: 2;
  }

  button.learn-more .circle .icon.arrow {
    left: 0.75rem;
    width: 1.125rem;
    height: 0.125rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 999px;
  }

  button.learn-more .circle .icon.arrow::before {
    position: absolute;
    content: "";
    top: -0.29rem;
    right: 0.0625rem;
    width: 0.625rem;
    height: 0.625rem;
    border-top: 0.125rem solid rgba(255, 255, 255, 0.9);
    border-right: 0.125rem solid rgba(255, 255, 255, 0.9);
    transform: rotate(45deg);
  }

  /* TEXT: hidden by default */
  button.learn-more .button-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    padding: 0.75rem 0;
    margin: 0 0 0 1.85rem;

    font-weight: 900;
    letter-spacing: 0.14em;
    font-size: 10px;
    line-height: 1.6;
    text-align: center;
    text-transform: uppercase;

    color: rgba(236, 253, 245, 0.98);

    /* ✅ hidden state */
    opacity: 0;
    transform: translateX(-10px);
    filter: blur(6px);
    pointer-events: none;

    /* ✅ delay reveal for drama */
    transition:
      opacity 0.32s cubic-bezier(0.65, 0, 0.076, 1),
      transform 0.45s cubic-bezier(0.65, 0, 0.076, 1),
      filter 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    transition-delay: 0s;
  }

  /* HOVER: expand circle */
  button.learn-more:hover .circle {
    width: 100%;
    border-color: rgba(16, 185, 129, 0.35);
    box-shadow:
      0 0 0 1px rgba(16, 185, 129, 0.22) inset,
      0 0 40px rgba(16, 185, 129, 0.12),
      0 18px 50px rgba(0, 0, 0, 0.4);
  }

  /* HOVER: arrow slide */
  button.learn-more:hover .circle .icon.arrow {
    transform: translate(1rem, 0);
  }

  /* ✅ HOVER: show text (with delay) */
  button.learn-more:hover .button-text {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0px);
    transition-delay: 0.08s; /* 👈 delay muncul */
  }

  /* keyboard focus should behave like hover */
  a:focus-visible button.learn-more .circle,
  button.learn-more:focus-visible .circle {
    width: 100%;
  }

  a:focus-visible button.learn-more .circle .icon.arrow,
  button.learn-more:focus-visible .circle .icon.arrow {
    transform: translate(1rem, 0);
  }

  a:focus-visible button.learn-more .button-text,
  button.learn-more:focus-visible .button-text {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0px);
    transition-delay: 0.08s;
  }

  button.learn-more:active {
    transform: scale(0.98);
  }

  @media (max-width: 420px) {
    button.learn-more {
      width: 12.5rem;
    }
  }
`;
