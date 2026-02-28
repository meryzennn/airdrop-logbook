"use client";

import React, { useId } from "react";
import styled from "styled-components";

type Props = {
  href: string;
  text: string;
  accent?: "emerald" | "sky";
};

export default function LegalGlowButton({
  href,
  text,
  accent = "emerald",
}: Props) {
  const rawId = useId();
  const filterId = `unopaq-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <StyledWrapper $filterId={filterId} $accent={accent}>
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <filter
          width="3000%"
          x="-1000%"
          height="3000%"
          y="-1000%"
          id={filterId}
        >
          <feColorMatrix
            values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 3 0"
          />
        </filter>
      </svg>

      <div className="wrap">
        <div className="backdrop" />
        <a href={href} className="button" aria-label={text}>
          <span className="a l" />
          <span className="a r" />
          <span className="a t" />
          <span className="a b" />
          <span className="text">{text}</span>
        </a>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{
  $filterId: string;
  $accent: "emerald" | "sky";
}>`
  .wrap {
    position: relative;
  }

  .button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    text-decoration: none;

    width: auto;
    height: 34px;
    padding: 0 12px;

    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;

    background: rgba(10, 14, 26, 0.7);
    color: rgba(255, 255, 255, 0.9);

    font-weight: 900;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;

    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .text {
    position: relative;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    border-radius: 12px;

    background:
      radial-gradient(
        circle at 50% 50%,
        #0000 0,
        #0000 22%,
        rgba(255, 255, 255, 0.1) 55%
      ),
      radial-gradient(ellipse 110% 110%, rgba(255, 255, 255, 0.35), #fff0);

    background-size:
      3px 3px,
      auto auto;
    transition: 0.25s ease;
  }

  .button:hover::before {
    opacity: 0.25;
  }

  .button:hover,
  .button:focus-visible {
    outline: none;
    transform: translateY(-1px);
    border-color: ${(p) =>
      p.$accent === "emerald"
        ? "rgba(16,185,129,0.35)"
        : "rgba(56,189,248,0.35)"};
    background: rgba(10, 14, 26, 0.85);
  }

  .button:active {
    transform: translateY(0px) scale(0.99);
  }

  .a {
    pointer-events: none;
    position: absolute;

    --w: 2px;
    --t: -36px;
    --s: calc(var(--t) * -1);
    --e: calc(100% + var(--t));

    --c1: ${(p) =>
      p.$accent === "emerald" ? "rgba(16,185,129,0)" : "rgba(56,189,248,0)"};
    --c2: ${(p) =>
      p.$accent === "emerald"
        ? "rgba(16,185,129,0.35)"
        : "rgba(56,189,248,0.35)"};
    --c3: ${(p) =>
      p.$accent === "emerald"
        ? "rgba(16,185,129,0.75)"
        : "rgba(56,189,248,0.75)"};
    --c4: ${(p) =>
      p.$accent === "emerald" ? "rgba(16,185,129,1)" : "rgba(56,189,248,1)"};

    --g:
      var(--c1), var(--c2) var(--s), var(--c3 var(--s)), var(--c4),
      var(--c3) var(--e), var(--c2) var(--e), var(--c1);
  }

  .a::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(4px) url(#${(p) => p.$filterId});
    z-index: -2;
  }

  .a::after {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(10px) url(#${(p) => p.$filterId});
    opacity: 0;
    z-index: -2;
    transition: 0.25s ease;
  }

  .button:hover .a::after {
    opacity: 1;
  }

  .l {
    left: -2px;
  }

  .r {
    right: -2px;
  }

  .l,
  .r {
    background: linear-gradient(var(--g));
    top: var(--t);
    bottom: var(--t);
    width: var(--w);
  }

  .t {
    top: -2px;
  }

  .b {
    bottom: -2px;
  }

  .t,
  .b {
    background: linear-gradient(90deg, var(--g));
    left: var(--t);
    right: var(--t);
    height: var(--w);
  }

  .backdrop {
    pointer-events: none;
    position: absolute;
    inset: -80px;

    opacity: 0.18;
    border-radius: 999px;

    background: radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0) 35%,
      rgba(16, 185, 129, 0.2) 70%
    );
    background-size: 3px 3px;

    z-index: -1;
  }
`;
