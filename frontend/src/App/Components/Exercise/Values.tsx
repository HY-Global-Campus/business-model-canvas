import { CSSProperties } from "react";
import ExpandingTextArea from "./ExpandingTextarea";

const ValuesExercise = () => {


  const panelStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    padding: '20px',
    margin: '0px 80px'
  };

  const imageStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
  };
 const separatorStyle: React.CSSProperties = {
    width: '1px', // Width of the vertical line
    backgroundColor: 'gray', // Color of the line
    height: '100%', // Full height of the container
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch', // To ensure the separator stretches full height
    height: '100vh', // Full height of the viewport
  };
	return(
	<div style={containerStyle}>
	<div style={panelStyle}>
        {/* Content for left panel, like title and inputs */}
	
             <div id='value-area'>
          <h2>Values</h2>
<label htmlFor="value-area"> Our actions are guided by our deepest values. What are your top three values? Write them below and let them guide your vision for the future.</label>
         <ExpandingTextArea
	instructionText="Value 1."
	id="values-text-area-1" // Unique ID for the textarea
	/> 
	<ExpandingTextArea
	instructionText="Value 2."
	id="values-text-area-2" // Unique ID for the textarea
	/>
	<ExpandingTextArea
	instructionText="Value 3."
	id="values-text-area-3" // Unique ID for the textarea
	/>

        </div>
      </div>
	<div style={separatorStyle} />

      <div style={panelStyle}>
        {/* Content for right panel, like image */}
        <h2>Tree of Values</h2>
        <img style={imageStyle} src="path-to-your-tree-image.png" alt="Tree of Values" />
      </div>
      </div>
	)

}

export default ValuesExercise
