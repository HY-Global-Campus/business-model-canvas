
// Book One Exercise Types
export interface ChooseChallenge {
  left: {
    title: string;
    description: string;
    answer: string;
  };

  right: {
    title: string;
    description: string;
    answer: string;
  };
}

export interface ChooseChallengeAnswer {
  left: {
    answer: string;
  };

  right: {
    answer: string;
  };
}

export interface IdentifyLeveragePoints {
  left: {
    title: string;
    description: string;
    question1: {
      title: string;
      answer: string;
    };
    question2: {
      title: string;
      answer: string;
    };
    question3: {
      title: string;
      answer: string;
    };
  };

  right: {
    title: string;
    description: string;
    answer: string;
  };
}

export interface IdentifyLeveragePointsAnswer {
  left: {
    question1: {
      answer: string;
    };
    question2: {
      answer: string;
    };
    question3: {
      answer: string;
    };
  };

  right: {
    answer: string;
  };
}

export interface RedefineChallenge {
  left: {
    title: string;
    description: string;
    answer: string;
  };
  right: {
    title: string;
    description: string;
    answer: string;
  };
}

export interface RedefineChallengeAnswer {
  left: {
    answer: string;
  };
  right: {
    answer: string;
  };
}

export interface Values {
  left: {
    title: string;
    description: string;
    question1: {
      title: string;
      answer: string;
    };
    question2: {
      title: string;
      answer: string;
    };
    question3: {
      title: string;
      answer: string;
    };
  };

  right: null;
}

export interface ValuesAnswer {
  left: {
    question1: {
      answer: string;
    };
    question2: {
      answer: string;
    };
    question3: {
      answer: string;
    };
  };

  right: null;
}

export interface FromFutureToPresent {
  left: {
    title: string;
    question: string;
    answer: string;
  };

  right: {
    title: string;
    description: string;
    question1: {
      title: string;
      answer: string;
    };
    question2: {
      title: string;
      answer: string;
    };
    question3: {
      title: string;
      answer: string;
    };
    question4: {
      title: string;
      answer: string;
    };
    question5: {
      title: string;
      answer: string;
    };
    question6: {
      title: string;
      answer: string;
    };
  };
}

export interface FromFutureToPresentAnswer {
  left: {
    answer: string;
  };

  right: {
    question1: {
      answer: string;
    };
    question2: {
      answer: string;
    };
    question3: {
      answer: string;
    };
    question4: {
      answer: string;
    };
    question5: {
      answer: string;
    };
    question6: {
      answer: string;
    };
  };
}

export interface FuturePitch {
  left: {
    title: string;
    answer: string;
  };
}

export interface FuturePitchAnswer {
  left: {
    answer: string;
  };
}

export interface BookOneExercises {
  chooseChallengeAnswer: ChooseChallengeAnswer;
  identifyLeveragePointsAnswer: IdentifyLeveragePointsAnswer;
  redefineChallengeAnswer: RedefineChallengeAnswer;
  valuesAnswer: ValuesAnswer;
  fromFutureToPresentAnswer: FromFutureToPresentAnswer;
  futurePitchAnswer: FuturePitchAnswer;
}

// Course Exercise Types
export interface CourseExercises {
  courseInfo?: {
    name?: string;
    scope?: string;
    targetStudents?: string;
    studentsSkillLevel?: string;
  };
  learningObjectives?: {
    learningOutcomes?: string;
  };
  coreContent?: {
    coreContentLeft?: string;
    coreContentRight?: string;
  };
  teachingMethods?: {
    value: string[][];
  };
  assessmentMethods?: {
    value: string[][];
  };
  gradingCriteriaReflection?: {
    gradingCriteria?: string;
    reflection?: string;
  };
  // Legacy fields that may still exist in some databases
  targetAudience?: {
    value: string;
  };
  courseStructure?: {
    value: string[][];
  };
  assessmentStrategy?: {
    value: string;
  };
  resources?: {
    value: string[][];
  };
  technology?: {
    value: string;
  };
  timeline?: {
    value: string[][];
  };
  evaluation?: {
    value: string;
  };
}

// Import BMC types
export * from './bmc';
