
interface StyledTextAreaProps {
  id: string,
  value: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly?: boolean;
}

const StyledTextArea: React.FC<StyledTextAreaProps> = ({id, value, onChange, readonly = false}) => {

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
   padding: '2px',
    fontSize: '16px',
    boxSizing: 'border-box',
    width: '100%',
    borderRadius: '10px',
    margin: '5px 0px',
    paddingLeft: '25px',
    resize: 'none',
    background: 'grey'

  };



  return (
    <div style={containerStyle}>
      <label htmlFor={id} style={labelStyle}></label>
      <textarea
        style={textAreaStyle}
        id={id}
        value={value}
        onChange={onChange}
        cols={50}
        readOnly={readonly}
      />
    </div>
  );
};

export default StyledTextArea;

