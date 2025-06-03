import { CSSProperties } from "react";
export const panelStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: '20px',
  margin: '0px 80px'
};

export const imageStyle: CSSProperties = {
  maxWidth: '100%',
  height: 'auto',
};
export const separatorStyle: React.CSSProperties = {
  width: '1px', // Width of the vertical line
  backgroundColor: 'gray', // Color of the line
  height: '100%', // Full height of the container
};

export const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch', // To ensure the separator stretches full height
  whiteSpace: 'pre-line',
};
