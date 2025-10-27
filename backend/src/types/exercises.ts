

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
  // Keep only exercises that are actually used in the current course
  // Remove: targetAudience, courseStructure, assessmentStrategy, resources, technology, timeline, evaluation
  // (These were in exercisesMeta but removed from navigation in earlier changes)
}

// BMC-related types
export interface BusinessContext {
  industry: string;
  stage: string;
  description: string;
}

export interface BMCExercises {
  customerSegments?: string;
  valuePropositions?: string;
  channels?: string;
  customerRelationships?: string;
  revenueStreams?: string;
  keyResources?: string;
  keyActivities?: string;
  keyPartnerships?: string;
  costStructure?: string;
}

