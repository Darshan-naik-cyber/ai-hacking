"use client";

import { useEffect } from "react";

// Extend Window interface to include ethereum (for browser extensions like MetaMask)
declare global {
    interface Window {
        ethereum?: any;
    }
}

export function WindowPolyfill() {
    useEffect(() => {
        // Defensive code to prevent window.ethereum errors on mobile
        if (typeof window !== "undefined") {
            // Prevent errors when browser extensions try to access window.ethereum
            try {
                // Create a proxy for window.ethereum if it doesn't exist
                if (!window?.ethereum) {
                    Object.defineProperty(window, "ethereum", {
                        get: function () {
                            return undefined;
                        },
                        set: function () {
                            // Silently ignore attempts to set window.ethereum
                            return true;
                        },
                        configurable: true,
                    });
                }

                // Also protect against direct property access
                if (window?.ethereum && !window?.ethereum?.selectedAddress) {
                    Object.defineProperty(window?.ethereum, "selectedAddress", {
                        get: function () {
                            return undefined;
                        },
                        set: function () {
                            // Silently ignore
                            return true;
                        },
                        configurable: true,
                    });
                }
            } catch (error) {
                // Silently catch and ignore errors
                console.debug("Window polyfill:", error);
            }
        }
    }, []);

    return null;
}
