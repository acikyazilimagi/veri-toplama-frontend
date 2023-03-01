import React, { Component } from "react";

class Loader extends Component {
  render() {
    return (
      <div
        className={`absolute z-10 h-full bg-zinc-900/60 w-full flex items-center justify-center transition-all ${
          this.props.isLoading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <svg
          className="animate-spin h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
}

export default Loader;
