
import React, { useState, useEffect, CSSProperties } from 'react';
import { getBookOneByUserId, BookOne } from '../../api/bookOneService';
import { useParams } from 'react-router';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';
import ChooseChallengeExercise from '../../Components/Exercise/ChooseChallenge'; 
import FromFutureToPresentExercise from '../../Components/Exercise/FromFutureToPresent';
import FuturePitchExercise from '../../Components/Exercise/FuturePitch';
import IdentifyLeveragePointsExercise from '../../Components/Exercise/IdentifyLeveragePoints';
import RedefineChallengeExercise from '../../Components/Exercise/RedefineChallenge';
import ValuesExercise from '../../Components/Exercise/Values';



const ViewAllExercises: React.FC = () => {

  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

	const { userId } = useParams()


  useEffect(() => {
    const fetchBookOne = async () => {
      try {
        const data = await getBookOneByUserId(userId!);
        setBookOne(data);
      } catch (err) {
        setError('Failed to fetch BookOne data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookOne();
    }
  }, [userId]);



  const pageStyle: CSSProperties = {
    padding: '0px 20px',
  };

  return (
    <>
      <div style={pageStyle}>
	<ExerciseContext.Provider value={{ bookOne, onUpdateBookOne: () => {}, loading, error, readonly: true }}>
		<ChooseChallengeExercise />
		<IdentifyLeveragePointsExercise />
		<RedefineChallengeExercise />
		<ValuesExercise />
		<FromFutureToPresentExercise />
		<FuturePitchExercise />

	</ExerciseContext.Provider>
      </div>
    </>
  );
};

export default ViewAllExercises;
