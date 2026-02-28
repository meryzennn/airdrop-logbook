"use client";

import React from "react";
import styled from "styled-components";

type Props =
  | {
      variant: "login";
      label?: string;
      className?: string;
    }
  | {
      variant: "dashboard";
      label?: string;
      href?: string;
      className?: string;
    };

export default function UserNavButton(props: Props) {
  const label =
    props.variant === "login"
      ? (props.label ?? "Log In")
      : (props.label ?? "Dashboard");

  const Inner = (
    <div className="btn-inner">
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
      {props.variant === "dashboard" ? <span className="arrow">→</span> : null}
    </div>
  );

  return (
    <StyledWrapper className={props.className}>
      {props.variant === "login" ? (
        <button type="submit" aria-label="User Login Button" className="btn">
          {Inner}
        </button>
      ) : (
        <a
          aria-label="Open Dashboard"
          href={props.href ?? "/dashboard"}
          className="btn"
        >
          {Inner}
        </a>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    /* smaller, navbar-friendly */
    width: auto;
    height: 40px;
    padding: 0;
    border-radius: 14px;
    cursor: pointer;
    transition: 0.25s ease;
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: grid;
    place-items: center;
    text-decoration: none;

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

  .btn:hover,
  .btn:focus-visible {
    background-color: rgba(16, 185, 129, 0.22);
    border-color: rgba(16, 185, 129, 0.35);
    box-shadow: 0 0 22px rgba(16, 185, 129, 0.25);
    outline: none;
    transform: translateY(-1px);
  }

  .btn:active {
    transform: translateY(0px) scale(0.99);
  }

  .btn-inner {
    height: 36px;
    padding: 0 12px;
    border-radius: 12px;

    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.06),
      rgba(0, 0, 0, 0)
    );
    background-color: rgba(7, 11, 21, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.1);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    color: rgba(255, 255, 255, 0.92);
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: 12px;
    font-family: inherit;
  }

  .btn-inner svg {
    width: 18px;
    height: 18px;
    fill: rgba(255, 255, 255, 0.92);
    opacity: 0.95;
  }

  .btn-inner p {
    margin: 0;
    line-height: 1;
    white-space: nowrap;
  }

  .arrow {
    opacity: 0.9;
    font-weight: 900;
  }
`;
