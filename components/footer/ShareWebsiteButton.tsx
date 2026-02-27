"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareWebsiteButton({
  label = "Share",
  title = "Airdrop Logbook",
}: {
  label?: string;
  title?: string;
}) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    try {
      // Native share (mobile)
      if (navigator.share) {
        await navigator.share({
          title,
          text: "Track intel. Execute missions. Secure the bag.",
          url,
        });
        showToast("Shared");
        return;
      }

      // Clipboard fallback (desktop)
      await navigator.clipboard.writeText(url);
      showToast("Copied link");
    } catch {
      // last fallback
      try {
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        showToast("Copied link");
      } catch {
        showToast("Copy failed");
      }
    }
  };

  return (
    <Wrap>
      <button className="button" onClick={onShare} type="button">
        <svg
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
        >
          <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
        </svg>
        {label}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="toast"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  display: inline-flex;

  .toast {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(9, 9, 11, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(236, 253, 245, 0.95);
    padding: 8px 12px;
    border-radius: 14px;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
    pointer-events: none;
    white-space: nowrap;
  }

  .button {
    cursor: pointer;
    padding: 1em;
    font-size: 1em;
    width: 7em;
    aspect-ratio: 1/0.25;
    color: white;
    background: #212121;
    background-size: cover;
    background-blend-mode: overlay;
    border-radius: 0.5em;
    outline: 0.1em solid #353535;
    border: 0;
    box-shadow: 0 0 1em 1em rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    position: relative;
  }

  .button:hover {
    transform: scale(1.06);
    box-shadow: 0 0 1em 0.45em rgba(0, 0, 0, 0.1);
    background: radial-gradient(
      circle at bottom,
      rgba(50, 100, 180, 0.5) 10%,
      #212121 70%
    );
    outline: 0;
  }

  .icon {
    fill: white;
    width: 1em;
    aspect-ratio: 1;
    top: 0;
    left: 0;
    margin: auto;
    transform: translate(-35%, 10%);
  }
`;
