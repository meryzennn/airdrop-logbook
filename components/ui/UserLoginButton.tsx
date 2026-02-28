"use client";

import React from "react";
import styled from "styled-components";

type Props = {
  label?: string;
  className?: string;
  size?: "sm" | "md";
};

/**
 * Dipakai DI DALAM <form action={...}>
 * => harus <button type="submit"> biar server action kepanggil.
 */
export default function UserLoginButton({
  label = "Log In",
  className,
  size = "sm",
}: Props) {
  return (
    <StyledWrapper className={className} data-size={size}>
      <button
        type="submit"
        aria-label="User Login Button"
        className="user-profile"
      >
        <div className="user-profile-inner">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g data-name="Layer 2" id="Layer_2">
              <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
            </g>
          </svg>
          <p>{label}</p>
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* default (sm) */
  --w: 108px;
  --h: 40px;
  --r: 14px;
  --inner-r: 12px;
  --pad-x: 10px;
  --gap: 10px;
  --font: 12px;
  --icon: 18px;

  &[data-size="md"] {
    --w: 124px;
    --h: 46px;
    --r: 15px;
    --inner-r: 13px;
    --pad-x: 12px;
    --gap: 12px;
    --font: 13px;
    --icon: 20px;
  }

  .user-profile {
    width: var(--w);
    height: var(--h);
    border-radius: var(--r);
    cursor: pointer;
    transition: 0.25s ease;
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 0;
    display: grid;
    place-items: center;

    /* themed neon glass */
    background:
      radial-gradient(
        120px 60px at 15% 20%,
        rgba(16, 185, 129, 0.35),
        rgba(16, 185, 129, 0) 60%
      ),
      linear-gradient(
        to bottom right,
        rgba(16, 185, 129, 0.55) 0%,
        rgba(16, 185, 129, 0) 42%
      );
    background-color: rgba(16, 185, 129, 0.12);
    box-shadow: 0 0 0 rgba(16, 185, 129, 0);
  }

  .user-profile:hover,
  .user-profile:focus-visible {
    background-color: rgba(16, 185, 129, 0.22);
    border-color: rgba(16, 185, 129, 0.35);
    box-shadow: 0 0 22px rgba(16, 185, 129, 0.25);
    outline: none;
    transform: translateY(-1px);
  }

  .user-profile:active {
    transform: translateY(0px) scale(0.99);
  }

  .user-profile-inner {
    width: calc(var(--w) - 6px);
    height: calc(var(--h) - 6px);
    border-radius: var(--inner-r);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.06),
      rgba(0, 0, 0, 0)
    );
    background-color: rgba(7, 11, 21, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.1);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap);

    color: rgba(255, 255, 255, 0.92);
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: var(--font);
    font-family: inherit;
  }

  .user-profile-inner svg {
    width: var(--icon);
    height: var(--icon);
    fill: rgba(255, 255, 255, 0.92);
    opacity: 0.95;
  }

  .user-profile-inner p {
    margin: 0;
    line-height: 1;
  }
`;
