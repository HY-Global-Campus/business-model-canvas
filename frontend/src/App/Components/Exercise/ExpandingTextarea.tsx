
interface ExpandingTextAreaProps {
  id: string;
  instructionText: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const ExpandingTextArea: React.FC<ExpandingTextAreaProps> = ({ id, instructionText, value, onChange, rows=4 }) => {

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1em', // Space below the whole component
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '0.5em', // Space between label and textarea
    // Add other styles as needed
  };

  const textAreaStyle: React.CSSProperties = {
    minHeight: '2em', // Height for two rows
    maxHeight: '30em', // Maximum height for 5 rows before scrolling
    overflowY: 'auto',
    resize: 'vertical',
    lineHeight: '1.5em',
    padding: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    width: '100%',
    borderRadius: '40px',
    margin: '10px 0px',
    paddingLeft: '25px',
  };



  return (
    <div style={containerStyle}>
      <label htmlFor={id} style={labelStyle}>{instructionText}</label>
      <textarea
        style={textAreaStyle}
        id={id}
        value={value}
        onChange={onChange}
        rows= {rows}
        cols={50}
      />
    </div>
  );
};

export default ExpandingTextArea;

