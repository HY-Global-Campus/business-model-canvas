import ExpandingTextArea from "./ExpandingTextarea";
import treeOfValues from '../../../assets/treeOfValues.png'
import { panelStyle, imageStyle, separatorStyle, containerStyle } from "./styles";

const ValuesExercise = () => {

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
        <img style={imageStyle} src={treeOfValues} alt="Tree of Values" />
      </div>
      </div>
	)

}

export default ValuesExercise
