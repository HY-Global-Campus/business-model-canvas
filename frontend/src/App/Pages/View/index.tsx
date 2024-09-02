
import React from 'react';
import ViewExercise from './ViewExercise';
import { useParams } from 'react-router';


const ViewAllExercise: React.FC = () => {


	const { userid} = useParams<{ userid: string }>();
	if (!userid) {
		throw new Error('No user id provided');
	}


	return (
		<>
			<div>
				<ViewExercise  userId={userid} />
			</div>
		</>
	);
};

export default ViewAllExercise;
