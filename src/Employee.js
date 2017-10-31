import React from "react";

export default function Employee ({photo, name}) {
  const imgStyle = {
    backgroundImage: `url('data:image/png;base64,${photo}')`,
    backgroundSize: "cover",
    width: 384,
    height: 384,
    marginBottom: 10,
  }
  return (
    <div style={containerStyle}>
      <div style={imgStyle} />
      <div style={smallTextSize}>Employee of the moment:</div>
      <div style={largeTextSize}>{name.toUpperCase()}</div>
    </div>
  );
}

const containerStyle = {
  backgroundColor: "white",
  color: 'rgb(100, 149, 233)',
};

const smallTextSize = {
  overflow: 'hidden',
  fontSize: 20,
}

const largeTextSize = {
  marginTop: 10,
  overflow: 'hidden',
  fontSize: 24,
}