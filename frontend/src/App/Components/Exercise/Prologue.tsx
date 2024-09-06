import React from 'react';
import { containerStyle, panelStyle, separatorStyle } from './styles';

const desc_left = `
This is your Book of Serendip. It is your main task in this programme. Fill it in and you will complete the first stage of your training. The main goal of this exercise is to create a desirable future vision based on a specific Boreal forest challenge.

The Book includes seven sections, which for the best learning experience, you need to fill them in order:

1. Choose and define a challenge

2. Map of connections

3. Identify leverage points

4. Redefine the chosen challenge

5. Values

6. Future vision and steps to achieve it

7. My future vision pitch

Enjoy writing the Book!
`;

const desc_right = `
This assignment will be peer reviewed, so to complete it, you need to submit your Book on the course platform, once it is ready. You will receive two anonymous reviews for it. You will also need to provide three reviews for other peers’ Books anonymously. The selection of the Books that you are requested to peer review is done automatically. The peer review will be done using a Likert scale of 1 (Strongly disagree) to 5 (Strongly agree).

The peer review criteria for the Book of Serendip are:

The challenge is clearly described
The map shows connections between information from at least three levels of the episode
At least two leverage points were identified
The future vision is clearly based on the values of the student
The student explained a credible desirable future and steps leading to it (not a dream)
The future vision pitch was coherent.
The student reflected on their learning journey in this episode.`;

const Prologue: React.FC = () => {




  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <h2>What is this assignment?</h2>
        <p>{desc_left}</p>

      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <h2>Peer review criteria</h2>
        <p>{desc_right}</p>
      </div>
    </div>
  );
};

export default Prologue;
